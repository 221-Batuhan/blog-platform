import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  _count: {
    comments: number;
    likes: number;
  };
  isLiked: boolean;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  _count: {
    posts: number;
  };
}

const Home: React.FC = () => {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
    fetchTags();
  }, [searchTerm, selectedTag, sortBy, currentPage]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        sort: sortBy
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await fetch(`/api/posts?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/posts/tags/all');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const { liked } = await response.json();
        setPosts(prev => prev.map(post => 
          post.id === postId ? { ...post, isLiked: liked } : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Blogged</h1>
          <p>Discover amazing stories, share your thoughts, and connect with writers from around the world</p>
          <div className="hero-actions">
            {user ? (
              <Link to="/create" className="hero-button primary">
                ✏️ Start Writing
              </Link>
            ) : (
              <>
                <Link to="/register" className="hero-button primary">
                  Join Blogged
                </Link>
                <Link to="/login" className="hero-button secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{posts.length}+</span>
            <span className="stat-label">Stories</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tags.length}+</span>
            <span className="stat-label">Topics</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </form>

          <div className="filter-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>

            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="tags-section">
          <h3>Popular Topics</h3>
          <div className="tags-grid">
            {tags.slice(0, 10).map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedTag(selectedTag === tag.name ? '' : tag.name);
                  setCurrentPage(1);
                }}
                className={`tag-button ${selectedTag === tag.name ? 'active' : ''}`}
                style={{ backgroundColor: selectedTag === tag.name ? tag.color : 'transparent', borderColor: tag.color }}
              >
                {tag.name}
                <span className="tag-count">({tag._count.posts})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2>Latest Stories</h2>
            {selectedTag && (
              <span className="filter-indicator">
                Filtered by: <strong>{selectedTag}</strong>
              </span>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="no-posts">
              <h3>No posts found</h3>
              <p>Try adjusting your search or filters</p>
              {user && (
                <Link to="/create" className="create-first-post">
                  Write the first post!
                </Link>
              )}
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  {post.image && (
                    <div className="post-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                  )}
                  <div className="post-content">
                    <div className="post-meta">
                      <div className="author-info">
                        <img 
                          src={post.author.avatar || '/default-avatar.png'} 
                          alt={post.author.name}
                          className="author-avatar"
                        />
                        <div>
                          <span className="author-name">{post.author.name}</span>
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="post-title">
                      <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </h3>
                    
                    {post.excerpt && (
                      <p className="post-excerpt">{post.excerpt}</p>
                    )}
                    
                    <div className="post-tags">
                      {post.tags.slice(0, 3).map(({ tag }) => (
                        <span 
                          key={tag.id} 
                          className="tag"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    
                    <div className="post-actions">
                      <div className="post-stats">
                        <span>💬 {post._count.comments}</span>
                        <span>❤️ {post._count.likes}</span>
                      </div>
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`like-button ${post.isLiked ? 'liked' : ''}`}
                        disabled={!user}
                      >
                        {post.isLiked ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
