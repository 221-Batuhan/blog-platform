import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    likes: number;
  };
}

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
  _count: {
    comments: number;
    likes: number;
  };
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
}

interface Analytics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageEngagement: number;
  topPost: {
    title: string;
    views: number;
    likes: number;
  };
  monthlyStats: Array<{
    month: string;
    posts: number;
    views: number;
    likes: number;
  }>;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser, token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    avatar: ''
  });

  const isOwnProfile = currentUser && user && currentUser.username === user.username;

  useEffect(() => {
    if (username) {
      fetchUserProfile();
      fetchUserPosts();
      if (isOwnProfile) {
        fetchAnalytics();
      }
    }
  }, [username, isOwnProfile]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/auth/profile/${username}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditForm({
          name: userData.name,
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        });
      } else {
        navigate('/404');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`/api/posts/user/${username}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/posts/analytics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.name}
            />
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-details">
            <h1>{user.name}</h1>
            <p className="username">@{user.username}</p>
            {user.bio && <p className="bio">{user.bio}</p>}
            <p className="joined">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            
            {isOwnProfile && (
              <button 
                onClick={() => setEditing(!editing)}
                className="edit-profile-button"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{user._count.posts}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user._count.comments}</span>
              <span className="stat-label">Comments</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user._count.likes}</span>
              <span className="stat-label">Likes</span>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="edit-profile-section">
          <form onSubmit={handleEditSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={editForm.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={editForm.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {isOwnProfile && analytics && (
        <div className="analytics-section">
          <h2>Analytics Dashboard</h2>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Overview</h3>
              <div className="analytics-stats">
                <div className="analytics-stat">
                  <span className="stat-icon">👁️</span>
                  <div>
                    <span className="stat-value">{analytics.totalViews.toLocaleString()}</span>
                    <span className="stat-label">Total Views</span>
                  </div>
                </div>
                <div className="analytics-stat">
                  <span className="stat-icon">❤️</span>
                  <div>
                    <span className="stat-value">{analytics.totalLikes.toLocaleString()}</span>
                    <span className="stat-label">Total Likes</span>
                  </div>
                </div>
                <div className="analytics-stat">
                  <span className="stat-icon">💬</span>
                  <div>
                    <span className="stat-value">{analytics.totalComments.toLocaleString()}</span>
                    <span className="stat-label">Total Comments</span>
                  </div>
                </div>
                <div className="analytics-stat">
                  <span className="stat-icon">📊</span>
                  <div>
                    <span className="stat-value">{analytics.averageEngagement.toFixed(1)}%</span>
                    <span className="stat-label">Avg. Engagement</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Top Performing Post</h3>
              <div className="top-post">
                <h4>{analytics.topPost.title}</h4>
                <div className="top-post-stats">
                  <span>👁️ {analytics.topPost.views.toLocaleString()} views</span>
                  <span>❤️ {analytics.topPost.likes.toLocaleString()} likes</span>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h3>Monthly Activity</h3>
              <div className="monthly-chart">
                {analytics.monthlyStats.map((stat, index) => (
                  <div key={index} className="month-bar">
                    <div className="bar" style={{ height: `${(stat.posts / 10) * 100}%` }}></div>
                    <span className="month-label">{stat.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="posts-section">
        <div className="posts-header">
          <h2>{isOwnProfile ? 'My Posts' : `${user.name}'s Posts`}</h2>
          {isOwnProfile && (
            <Link to="/create" className="create-post-button">
              ✏️ Write New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>{isOwnProfile ? 'Start writing to share your thoughts with the world!' : 'This user hasn\'t published any posts yet.'}</p>
            {isOwnProfile && (
              <Link to="/create" className="create-first-post">
                Write your first post!
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
                  
                  <div className="post-meta">
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="post-stats">
                      <span>💬 {post._count.comments}</span>
                      <span>❤️ {post._count.likes}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
