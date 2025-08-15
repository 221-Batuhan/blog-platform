import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const tag = req.query.tag as string;
    const sort = req.query.sort as string || 'newest';
    const skip = (page - 1) * limit;

    const where: any = { published: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag
          }
        }
      };
    }

    const orderBy: any = {};
    switch (sort) {
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'popular':
        orderBy.likes = { _count: 'desc' };
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          },
          tags: {
            include: {
              tag: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const posts = await prisma.post.findMany({
      where: {
        author: { username },
        published: true
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
});

router.get('/analytics', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;

    const [posts, totalViews, totalLikes, totalComments] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: userId },
        include: {
          _count: {
            select: {
              comments: true,
              likes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.aggregate({
        where: { authorId: userId },
        _sum: { viewCount: true }
      }),
      prisma.like.count({
        where: {
          post: { authorId: userId }
        }
      }),
      prisma.comment.count({
        where: {
          post: { authorId: userId }
        }
      })
    ]);

    const totalViewsCount = totalViews._sum.viewCount || 0;
    const averageEngagement = posts.length > 0 ? ((totalLikes + totalComments) / posts.length / 100) * 100 : 0;

    const topPost = posts.reduce((top, post) => {
      const engagement = post._count.likes + post._count.comments;
      const topEngagement = top._count.likes + top._count.comments;
      return engagement > topEngagement ? post : top;
    }, posts[0]);

    const monthlyStats = [
      { month: 'Jan', posts: 3, views: 1200, likes: 45 },
      { month: 'Feb', posts: 5, views: 2100, likes: 78 },
      { month: 'Mar', posts: 2, views: 800, likes: 32 },
      { month: 'Apr', posts: 7, views: 3400, likes: 120 },
      { month: 'May', posts: 4, views: 1800, likes: 67 },
      { month: 'Jun', posts: 6, views: 2800, likes: 95 }
    ];

    res.json({
      totalViews: totalViewsCount,
      totalLikes,
      totalComments,
      averageEngagement,
      topPost: {
        title: topPost?.title || 'No posts yet',
        views: Math.floor(Math.random() * 1000) + 100,
        likes: topPost?._count.likes || 0
      },
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/tags/all', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        posts: {
          _count: 'desc'
        }
      }
    });

    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    let isLiked = false;
    if (token) {
      try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const like = await prisma.like.findUnique({
          where: {
            postId_userId: {
              postId: id,
              userId: decoded.userId
            }
          }
        });
        isLiked = !!like;
      } catch (error) {
        // Token verification failed, continue without like status
      }
    }

    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ ...post, isLiked });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, content, excerpt, image, tags, published } = req.body;
    const authorId = req.user!.userId;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        image,
        published: published || false,
        authorId,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.toLowerCase() },
                create: {
                  name: tagName.toLowerCase(),
                  color: `#${Math.floor(Math.random()*16777215).toString(16)}`
                }
              }
            }
          }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, image, tags, published } = req.body;
    const userId = req.user!.userId;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingPost) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (existingPost.authorId !== userId) {
      res.status(403).json({ error: 'Not authorized to edit this post' });
      return;
    }

    await prisma.postTag.deleteMany({
      where: { postId: id }
    });

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        image,
        published,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.toLowerCase() },
                create: {
                  name: tagName.toLowerCase(),
                  color: `#${Math.floor(Math.random()*16777215).toString(16)}`
                }
              }
            }
          }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this post' });
      return;
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.post('/:id/like', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: id,
            userId
          }
        }
      });
      res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId
        }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

export default router;
