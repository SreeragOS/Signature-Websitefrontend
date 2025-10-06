export default PostList;
const categories = [
  'Art',
  'Profession',
  'Literature'
];
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './postlist.css';
// import ParticleBackground from './particlebackground';


import { useParams } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('is_superuser') === 'true';
  const navigate = useNavigate();
  const { category, subcategory } = useParams();

  useEffect(() => {
    api.get('posts/')
      .then(res => setPosts(res.data))
      .catch(err => {
        console.error(err);
        setError('Could not fetch posts');
      });
  }, [refresh]);

  const handleCommentChange = (key, text) => {
    setCommentText(prev => ({ ...prev, [key]: text }));
  };

  const handleCommentSubmit = (postId) => {
    api.post(`posts/${postId}/comments/`, {
      post: postId,
      content: commentText[postId],
    })
    .then(() => {
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setRefresh(prev => !prev);
    })
    .catch(err => {
      console.error(err);
    });
  };

  // Handle reply to a comment
  // For simple commenting system, treat replies as regular comments
  const handleReplySubmit = (postId, commentId) => {
    api.post(`posts/${postId}/comments/`, {
      post: postId,
      content: commentText[`reply-${commentId}`],
      parent: commentId,
    })
    .then(() => {
      setCommentText(prev => ({ ...prev, [`reply-${commentId}`]: '' }));
      setRefresh(prev => !prev);
    })
    .catch(err => {
      console.error(err);
    });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`posts/${postId}/`);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Filter posts by searchQuery (case-insensitive, by title)
  let filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Further filter by category/subcategory if present in URL
  if (category && subcategory) {
    const norm = str => str?.toLowerCase().trim().replace(/\s+/g, '');
    filteredPosts = filteredPosts.filter(post =>
      norm(post.category) === norm(category) && norm(post.subcategory) === norm(subcategory)
    );
  }

  // Helper for profile/about section
  const ProfileSection = (
    <div className="profile-section">
      <img src="/pic.jpg" alt="Profile" className="profile-photo" />
      <div className="profile-desc">
        <h4>Dr S Jayasree</h4>
        <p>I'm Dr S Jayasree, a veterinary surgeon and artist who finds beauty in both healing and creation. Whether I’m in the operating room or the studio, I bring precision, compassion, and artistry to everything I do.</p>
      </div>
      <div className="contact-section" style={{ marginTop: '1.5rem', padding: '1rem 0', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <h5 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Contact Me</h5>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.7rem' }}>
          <a href="https://www.facebook.com/jayasree.siji" target="_blank" rel="noopener noreferrer">
            <img src="/fb.png" alt="Facebook" style={{ width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          </a>
          <a href="https://linkedin.com/in/dr-s-jayasree" target="_blank" rel="noopener noreferrer">
            <img src="/linkedin.png" alt="LinkedIn" style={{ width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          </a>
          <a href="https://instagram.com/dr_s_jayasree" target="_blank" rel="noopener noreferrer">
            <img src="/ig.png" alt="Instagram" style={{ width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          </a>
          <a href="https://youtube.com/@DrSJayasreeVeterinarian" target="_blank" rel="noopener noreferrer">
            <img src="/yt.png" alt="YouTube" style={{ width: '40px', height: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          </a>
        </div>
      </div>
    </div>
  );

  // Use window.matchMedia to detect mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="container posts-main-flex">
      {isMobile && (
        <div style={{ width: '100%' }}>
          {ProfileSection}
          {isAdmin && (
            <button
              className="posts-search-btn mb-4"
              style={{ background: 'linear-gradient(90deg, #14724b 0%, #0f4e34 100%)', fontSize: '1.08rem', fontWeight: 700 }}
              onClick={() => navigate('/create')}
            >
              + Create Post
            </button>
          )}
          <form
            className="posts-search-bar"
            onSubmit={e => {
              e.preventDefault();
              setSearchQuery(search);
            }}
            autoComplete="off"
          >
            <input
              type="text"
              name="search"
              className="posts-search-input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="posts-search-btn">Search</button>
          </form>
        </div>
      )}
      <main className="posts-center-col">
        {/* Only show profile section above posts on mobile */}
        {/* ...existing code... */}
        {error && <p className="error">{error}</p>}
        {filteredPosts.length === 0 ? (
          <p>No posts found</p>
        ) : (
          <ul className="post-list">
            {filteredPosts.map(post => (
              <li key={post.id} className="post-item">
                <p className="post-date text-sm text-gray-500 mb-1">
                  Posted on {new Date(post.created_at).toLocaleDateString()}
                </p>
                <h3>{post.title}</h3>
                {post.image && (
                  <img
                    src={
                      post.image.startsWith('http')
                        ? post.image
                        : `http://localhost:8000${
                            post.image.startsWith('/') ? '' : '/media/'
                          }${post.image}`
                    }
                    alt="Post"
                    className="post-image"
                  />
                )}
                <p>{post.content}</p>
                {post.video && (
                  <video
                    controls
                    style={{ maxWidth: '100%', margin: '1rem 0' }}
                    src={
                      post.video.startsWith('http')
                        ? post.video
                        : `http://localhost:8000${post.video.startsWith('/') ? '' : '/media/'}${post.video}`
                    }
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {/* Show document download for any post with a document */}
                {post.document && (
                  <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {(() => {
                      const docUrl = post.document.startsWith('http')
                        ? post.document
                        : `http://localhost:8000${post.document.startsWith('/') ? '' : '/media/'}${post.document}`;
                      const ext = docUrl.split('.').pop().toLowerCase();
                      let iconSrc = '';
                      if (ext === 'pdf') iconSrc = '/pdf.png';
                      else if (ext === 'doc' || ext === 'docx') iconSrc = '/docx.png';
                      else if (ext === 'ppt' || ext === 'pptx') iconSrc = '/ppt.png';
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
                          {iconSrc && (
                            <img src={iconSrc} alt={ext + ' icon'} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                          )}
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = docUrl;
                              link.download = docUrl.split('/').pop();
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{
                              padding: '0.6rem 1.2rem',
                              background: 'linear-gradient(90deg, #f8ffae 0%, #43c6ac 100%)',
                              color: '#333',
                              borderRadius: '8px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              fontSize: '1.08rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Download
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}
                {isAdmin && (
                  <div className="mt-2 space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/edit/${post.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {/* Comments toggle */}
                <div style={{ marginTop: '1.2rem' }}>
                  {!commentText[`showComments-${post.id}`] ? (
                    <span
                      style={{ color: '#007bff', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', fontSize: '1.08rem' }}
                      onClick={() => setCommentText(prev => ({ ...prev, [`showComments-${post.id}`]: true }))}
                    >
                      Comments
                    </span>
                  ) : (
                    <>
                      <ul className="mb-2 pl-4 list-disc">
                        {post.comments?.length > 0 ? (
                          post.comments.map(comment => (
                            <li key={comment.id} style={{ marginBottom: '1rem' }}>
                              <strong>{comment.author || 'Anonymous'}:</strong> {comment.content}
                              {/* Replies toggle */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div style={{ marginTop: '0.3rem' }}>
                                  {!commentText[`showReplies-${comment.id}`] ? (
                                    <span
                                      style={{ color: '#007bff', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'underline' }}
                                      onClick={() => setCommentText(prev => ({ ...prev, [`showReplies-${comment.id}`]: true }))}
                                    >
                                      View replies
                                    </span>
                                  ) : (
                                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'circle' }}>
                                      {comment.replies.map(reply => (
                                        <li key={reply.id}>
                                          <strong>{reply.author || 'Anonymous'}:</strong> {reply.content}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                              {/* Reply link for each comment */}
                              {token && (
                                <div style={{ marginTop: '0.5rem' }}>
                                  {!commentText[`showReply-${comment.id}`] ? (
                                    <span
                                      style={{ color: '#007bff', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'underline' }}
                                      onClick={() => setCommentText(prev => ({ ...prev, [`showReply-${comment.id}`]: true }))}
                                    >
                                      reply
                                    </span>
                                  ) : (
                                    <div>
                                      <input
                                        type="text"
                                        value={commentText[`reply-${comment.id}`] || ''}
                                        onChange={e => handleCommentChange(`reply-${comment.id}`, e.target.value)}
                                        placeholder="Write a reply..."
                                        className="w-full p-2 border rounded mb-2"
                                      />
                                      <button
                                        onClick={() => {
                                          handleReplySubmit(post.id, comment.id);
                                          setCommentText(prev => ({ ...prev, [`showReply-${comment.id}`]: false }));
                                        }}
                                        className="bg-blue-500 text-white py-1 px-3 rounded"
                                      >
                                        Reply
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </li>
                          ))
                        ) : (
                          <li>No comments yet</li>
                        )}
                      </ul>
                      {token && (
                        <div className="comment-form mt-2">
                          <input
                            type="text"
                            value={commentText[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border rounded mb-2"
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="bg-blue-600 text-white py-1 px-4 rounded"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      {/* Only show sidebar profile on desktop */}
      {!isMobile && (
        <aside className="posts-search-sidebar">
          {isAdmin && (
            <button
              className="posts-search-btn mb-4"
              style={{ background: 'linear-gradient(90deg, #14724b 0%, #0f4e34 100%)', fontSize: '1.08rem', fontWeight: 700 }}
              onClick={() => navigate('/create')}
            >
              + Create Post
            </button>
          )}
          <form
            className="posts-search-bar"
            onSubmit={e => {
              e.preventDefault();
              setSearchQuery(search);
            }}
            autoComplete="off"
          >
            <input
              type="text"
              name="search"
              className="posts-search-input"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="posts-search-btn">Search</button>
          </form>
          {ProfileSection}
        </aside>
      )}
    </div>
  );
}