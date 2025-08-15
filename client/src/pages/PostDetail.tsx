import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './PostDetail.css';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    bio: string | null;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  comments?: Comment[];
  _count: {
    comments: number;
    likes: number;
  };
  isLiked: boolean;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/posts/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure comments array exists
        setPost({
          ...data,
          comments: data.comments || []
        });
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const { liked } = await response.json();
        setPost(prev => prev ? { ...prev, isLiked: liked } : null);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          postId: id,
          content: comment
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setPost(prev => prev ? {
          ...prev,
          comments: [newComment, ...(prev.comments || [])]
        } : null);
        setComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPost(prev => prev ? {
          ...prev,
          comments: (prev.comments || []).filter(c => c.id !== commentId)
        } : null);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="post-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-error">
        <h2>{error || 'Post not found'}</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <div className="post-header">
        <div className="post-meta">
          <div className="author-info">
            <img 
              src={post.author.avatar || '/default-avatar.png'} 
              alt={post.author.name}
              className="author-avatar"
            />
            <div>
              <h3>{post.author.name}</h3>
              <span>@{post.author.username}</span>
            </div>
          </div>
          <div className="post-stats">
            <span>{post._count.comments} comments</span>
            <span>{post._count.likes} likes</span>
            <span>{post.viewCount} views</span>
          </div>
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        <div className="post-tags">
          {post.tags.map(({ tag }) => (
            <span 
              key={tag.id} 
              className="tag"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {post.image && (
        <div className="post-image">
          <img src={post.image} alt={post.title} />
        </div>
      )}

      <div className="post-content">
        {post.content}
      </div>

      <div className="post-actions">
        <button 
          className={`like-button ${post.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {post.isLiked ? '❤️' : '🤍'} {post._count.likes}
        </button>
        {user && post.author.id === user.id && (
          <button 
            className="edit-button"
            onClick={() => navigate(`/edit/${post.id}`)}
          >
            Edit Post
          </button>
        )}
      </div>

      <div className="comments-section">
        <h3>Comments ({post._count.comments})</h3>
        
        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={submitting}
            />
            <button type="submit" disabled={!comment.trim() || submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}

        <div className="comments-list">
          {(post.comments || []).map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  <img 
                    src={comment.author.avatar || '/default-avatar.png'} 
                    alt={comment.author.name}
                  />
                  <div>
                    <strong>{comment.author.name}</strong>
                    <span>@{comment.author.username}</span>
                  </div>
                </div>
                {user && comment.author.id === user.id && (
                  <button 
                    className="delete-comment"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
