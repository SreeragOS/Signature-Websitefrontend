  // Admin delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await api.delete(`comments/${commentId}/delete/`);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error('Delete comment failed:', err);
    }
  };
export default PostList;
const categories = [
  'Art',
  'Profession',
  'Literature',
  'Personal',
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

  // Filter and sort posts by searchQuery relevance (case-insensitive, by title and content)
  let filteredPosts = posts
    .map(post => {
      const titleMatches = (post.title.match(new RegExp(searchQuery, 'gi')) || []).length;
      const contentMatches = (post.content?.match(new RegExp(searchQuery, 'gi')) || []).length;
      const relevance = titleMatches * 2 + contentMatches; // title matches count double
      return { ...post, relevance };
    })
    .filter(post => post.relevance > 0 || !searchQuery);

  // On homepage, show newest posts first
  if (!category && !subcategory) {
    filteredPosts = filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    filteredPosts = filteredPosts.sort((a, b) => b.relevance - a.relevance);
  }
  // Further filter by category/subcategory if present in URL
  if (category && subcategory) {
    const norm = str => str?.toLowerCase().trim().replace(/\s+/g, '');
    filteredPosts = filteredPosts.filter(post => {
      if (norm(category) === 'personal' && norm(subcategory) === 'achievements') {
        return norm(post.category) === 'personal' && norm(post.subcategory) === 'achievements';
      }
      return norm(post.category) === norm(category) && norm(post.subcategory) === norm(subcategory);
    });
  } else {
    // On homepage, exclude posts in category 'veterinary' and subcategory 'files'
    filteredPosts = filteredPosts.filter(post => {
      const norm = str => str?.toLowerCase().trim().replace(/\s+/g, '');
      return !(norm(post.category) === 'veterinary' && norm(post.subcategory) === 'files');
    });
  }

  // Helper for profile/about section
  const ProfileSection = (
    <div className="profile-section">
      <img src="/pic.jpg" alt="Profile" className="profile-photo" style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }} />
      <div className="profile-desc">
        <h4>Dr S Jayasree</h4>
        <p>I am Dr. S. Jayasree , a Veterinary Doctor, writer, artist, and cancer survivor  who finds beauty in both healing and creation. Wherever I'm  I try to bring precision, compassion, and artistry to everything I do.</p>
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

  // Recursive comment rendering
  const renderComment = (comment, postId) => {
    // Replies are hidden by default unless toggled
    const [showReplies, setShowReplies] = [
      commentText[`showReplies-${comment.id}`] ?? false,
      (val) => setCommentText(prev => ({ ...prev, [`showReplies-${comment.id}`]: val }))
    ];
    return (
      <li key={comment.id} style={{ marginBottom: '1rem' }}>
        <div style={{display:'flex', alignItems:'center', gap:'0.7rem'}}>
          <span style={{fontSize:'1.08rem'}}><strong>{comment.author || 'Anonymous'}:</strong> {comment.content}</span>
          {isAdmin && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              style={{
                background: '#2563eb',
                color: 'white',
                padding: '0.12rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
                border: 'none',
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
              }}
            >
              Delete
            </button>
          )}
        </div>
        {/* Replies toggle */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '0.3rem' }}>
            {showReplies ? (
              <>
                <span
                  style={{ color: '#001f4d', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => setShowReplies(false)}
                >
                  <span style={{fontSize:'1.3em', fontWeight:'bold', display:'inline-block', transform:'rotate(-90deg)', fontFamily:'monospace'} }>&gt;</span> Hide replies
                </span>
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', listStyle: 'circle' }}>
                  {comment.replies.map(reply => renderComment(reply, postId))}
                </ul>
              </>
            ) : (
              <span
                style={{ color: '#001f4d', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                onClick={() => setShowReplies(true)}
              >
                <span style={{fontSize:'1.3em', fontWeight:'bold', display:'inline-block', transform:'rotate(90deg)', fontFamily:'monospace'} }>&gt;</span> View replies
              </span>
            )}
          </div>
        )}
        {/* Reply link for each comment */}
        {token && (
          <div style={{ marginTop: '0.5rem' }}>
            {!commentText[`showReply-${comment.id}`] ? (
              <span
                style={{ color: '#001f4d', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'none' }}
                onClick={() => setCommentText(prev => ({ ...prev, [`showReply-${comment.id}`]: true }))}
              >
                reply
              </span>
            ) : (
              <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
                <textarea
                  value={commentText[`reply-${comment.id}`] || ''}
                  onChange={e => handleCommentChange(`reply-${comment.id}`, e.target.value)}
                  placeholder="Write a reply..."
                  className="p-2 rounded mb-2"
                  style={{width:'220px', minHeight:'48px', border:'none', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', resize:'vertical'}}
                />
                <button
                  onClick={() => {
                    handleReplySubmit(postId, comment.id);
                    setCommentText(prev => ({ ...prev, [`showReply-${comment.id}`]: false }));
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #14724b 0%, #0f4e34 100%)',
                    color: '#d8f3ed',
                    padding: '0.12rem 0.5rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    border: 'none',
                    fontSize: '1.0rem',
                    cursor: 'pointer',
                    marginTop: '0.2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    height: '1.5rem',
                    lineHeight: '1.1',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                    transition: 'none'
                  }}
                >
                  Reply
                </button>
                <button
                  onClick={() => setCommentText(prev => ({ ...prev, [`showReply-${comment.id}`]: false }))}
                  style={{
                    background: '#64748b',
                    color: 'white',
                    padding: '0.12rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    border: 'none',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    marginTop: '0.2rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                    height: '1.5rem',
                    lineHeight: '1.1'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </li>
    );
  };

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
                <div>
                  {(!category && !subcategory) ? (
                    commentText[`showFull-${post.id}`] ? (
                      <>
                        <p style={{marginTop:'0.5rem', fontSize:'1rem'}}>{post.content}</p>
                        <span
                          style={{ color: '#001f4d', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'none', fontWeight: 600, marginLeft: '0.5rem' }}
                          onClick={() => setCommentText(prev => ({ ...prev, [`showFull-${post.id}`]: false }))}
                        >
                          Show less
                        </span>
                      </>
                    ) : (
                      <>
                        <p style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '0.5rem',
                          fontSize: '1rem'
                        }}>
                          {post.content}
                        </p>
                        {post.content &&
                          (
                            (() => {
                              const sentenceCount = (post.content.match(/[.!?]+/g) || []).length;
                              return (sentenceCount > 2 || post.content.length > 100);
                            })()
                          ) && (
                          <span
                            style={{ color: '#001f4d', cursor: 'pointer', fontSize: '0.98rem', textDecoration: 'none', fontWeight: 600, marginLeft: '0.5rem' }}
                            onClick={() => setCommentText(prev => ({ ...prev, [`showFull-${post.id}`]: true }))}
                          >
                            Show more
                          </span>
                        )}
                      </>
                    )
                  ) : (
                    <p>{post.content}</p>
                  )}
                </div>
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
                              background: '#2563eb',
                              color: 'white',
                              padding: '0.32rem 0.21rem',
                              borderRadius: '6px',
                              fontWeight: 600,
                              border: 'none',
                              fontSize: '.88rem',
                              cursor: 'pointer',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
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
                  <div className="mt-2 space-x-2" style={{display:'flex', gap:'0.7rem'}}>
                    <button
                      onClick={() => navigate(`/edit/${post.id}`)}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '0.12rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                        border: 'none',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '0.12rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                        border: 'none',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
                {/* Comments toggle */}
                <div style={{ marginTop: '1.2rem' }}>
                  {!commentText[`showComments-${post.id}`] ? (
                    (() => {
                      const commentCount = post.comments?.filter(c => !c.parent).length || 0;
                      return (
                        <span
                          style={{ color: '#222', cursor: 'pointer', fontWeight: 600, fontSize: '1.08rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                          onClick={() => setCommentText(prev => ({ ...prev, [`showComments-${post.id}`]: true }))}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          {commentCount > 0 ? commentCount : ''}
                        </span>
                      );
                    })()
                  ) : (
                    <>
                      <span
                        style={{ color: '#222', cursor: 'pointer', fontWeight: 600, fontSize: '1.08rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.7rem' }}
                        onClick={() => setCommentText(prev => ({ ...prev, [`showComments-${post.id}`]: false }))}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle'}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        {post.comments?.filter(c => !c.parent).length || ''}
                      </span>
                      <ul className="mb-2 pl-4 list-disc">
                        {post.comments?.length > 0 ? (
                          post.comments
                            .filter(comment => !comment.parent) // Only top-level comments
                            .map(comment => renderComment(comment, post.id))
                        ) : (
                          <li>No comments yet</li>
                        )}
                      </ul>
                      {token && (
                        <div className="comment-form mt-2">
                          <textarea
                            value={commentText[post.id] || ''}
                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 rounded mb-2"
                            style={{minHeight:'48px', border:'none', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', resize:'vertical'}}
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="bg-blue-600 text-white py-1 px-4 rounded"
                          >
                            Comment
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