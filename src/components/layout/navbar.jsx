
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';

const categories = [
  {
    name: 'Art',
    subcategories: ['Drawings', 'Paintings', 'Crafts']
  },
  {
    name: 'Veterinary',
    subcategories: ['Experiences', 'Case Studies', 'Projects', 'Articles', 'Files']
  },
  {
    name: 'Literature',
    subcategories: ['Articles', 'Stories', 'Novels', 'Poems', 'Autobiography']
  },
  {
    name: 'Personal',
    subcategories: ['personal'] // must match backend value
  }
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // User dropdown state
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  // Hide dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (!e.target.closest('[aria-label="User menu"]') && !e.target.closest('ul')) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('username');
    navigate('/signup');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const buttonStyle = {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'none'
  };

  const redButton = {
    ...buttonStyle,
    backgroundColor: '#dc3545'
  };

  return (
    <nav className="navbar-martha bg-white text-gray-900 shadow-md w-full" style={{ minHeight: '60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem', width: '100%' }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '10px' }}
          >
            <img
              src="/5.jpg"
              alt="logo"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
            <h1 className="logo-text text-lg font-bold" style={{ fontFamily: 'Pacifico, cursive', fontSize: '2rem', letterSpacing: '2px' }}>Dr S Jayasree's Signature</h1>
          </div>
        </div>
        {/* Right: Categories and Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ul className="navbar-categories" style={{ display: 'flex', gap: '1.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {categories.map(cat => (
              <li key={cat.name} style={{ position: 'relative' }}>
                <a href="#" className="navbar-category-link" style={{
                  color: '#070707ff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1.35rem',
                  fontFamily: 'Pacifico, cursive',
                  letterSpacing: '2px',
                  background: 'rgba(0,0,0,0.00)',
                  padding: '0.2rem 0.7rem',
                  borderRadius: '8px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.12)'
                }}>{cat.name}</a>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <ul className="navbar-dropdown" style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                    {cat.subcategories.map(sub => (
                      <li key={sub} style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
                        <a
                          href="#"
                          className="navbar-dropdown-link"
                          onClick={e => {
                            e.preventDefault();
                            navigate(`/posts/${encodeURIComponent(cat.name)}/${encodeURIComponent(sub)}`);
                          }}
                        >
                          {sub}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {!isAuthPage && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button
                className="navbar-user-btn"
                onClick={() => {
                  setShowUserDropdown((prev) => !prev);
                }}
                aria-label="User menu"
                style={{ background: 'none', border: 'none', boxShadow: 'none', padding: 0, width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span className="navbar-user-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                  <img src="/9.webp" alt="User" style={{ width: '32px', height: '32px', objectFit: 'contain', display: 'block', borderRadius: 0, background: 'none', margin: 0, padding: 0 }} />
                </span>
              </button>
              {showUserDropdown && (
                <ul style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  borderRadius: '8px',
                  minWidth: '120px',
                  zIndex: 999,
                  padding: '0.5rem 0',
                  listStyle: 'none',
                  margin: 0
                }}>
                  {token ? (
                    <li>
                      <button
                        onClick={handleLogout}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 1.2rem',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >Logout</button>
                    </li>
                  ) : (
                    <>
                      <li>
                        <button
                          onClick={() => { setShowUserDropdown(false); navigate('/login'); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 1.2rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >Login</button>
                      </li>
                      <li>
                        <button
                          onClick={() => { setShowUserDropdown(false); navigate('/signup'); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 1.2rem',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >Signup</button>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}


export default Navbar;
import React from 'react';
