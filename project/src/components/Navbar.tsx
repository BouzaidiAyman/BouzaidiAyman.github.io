import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function Navbar({ currentPage, navigate, showToast }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50); }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    await signOut();
    navigate('home');
    showToast('Logged out successfully', 'success');
    setMenuOpen(false);
  }

  const navLinkStyle = (page: string): React.CSSProperties => ({
    textDecoration: 'none',
    color: currentPage === page ? '#d4a574' : '#fff',
    fontSize: '1.1rem',
    fontWeight: 500,
    opacity: currentPage === page ? 1 : 0.9,
    transition: 'color 0.3s ease',
    fontFamily: "'Cormorant Garamond', serif",
    cursor: 'pointer',
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%',
      background: scrolled ? 'rgba(15,28,46,0.98)' : 'rgba(15,28,46,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid #d4a574',
      zIndex: 1000,
      transition: 'all 0.4s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(15,28,46,0.3)' : 'none',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <a
          href="#home"
          onClick={e => { e.preventDefault(); navigate('home'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            textDecoration: 'none', color: '#fff',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem', fontWeight: 700,
          }}
        >
          <span style={{ color: '#d4a574', fontSize: '1.6rem' }}>◆</span>
          <span>Cultural Club</span>
        </a>

        {/* Desktop nav */}
        <ul style={{
          display: 'flex',
          listStyle: 'none',
          gap: '2.5rem',
          alignItems: 'center',
          margin: 0, padding: 0,
        }} className="desktop-nav">
          {[
            { label: 'Home', page: 'home' },
            { label: 'Library', page: 'library' },
            { label: 'Contact', page: 'contact' },
          ].map(item => (
            <li key={item.page}>
              <a
                href={`#${item.page}`}
                style={navLinkStyle(item.page)}
                onClick={e => { e.preventDefault(); navigate(item.page); }}
              >{item.label}</a>
            </li>
          ))}
          {user ? (
            <>
              <li>
                <a href="#profile" style={{
                  ...navLinkStyle('profile'),
                  padding: '0.5rem 1.5rem',
                  border: '2px solid #d4a574',
                  borderRadius: '25px',
                  color: '#d4a574',
                }} onClick={e => { e.preventDefault(); navigate('profile'); }}>
                  {profile?.name?.split(' ')[0] || 'Profile'}
                </a>
              </li>
              <li>
                <a href="#logout" style={{
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #d4a574 0%, #f4d03f 100%)',
                  color: '#0f1c2e',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: 'all 0.3s',
                  display: 'inline-block',
                }} onClick={handleLogout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="#login" style={{
                  ...navLinkStyle('login'),
                  padding: '0.5rem 1.5rem',
                  border: '2px solid #d4a574',
                  borderRadius: '25px',
                }} onClick={e => { e.preventDefault(); navigate('login'); }}>
                  Login
                </a>
              </li>
              <li>
                <a href="#register" style={{
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #d4a574 0%, #f4d03f 100%)',
                  color: '#0f1c2e',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: 'all 0.3s',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(212,165,116,0.4)',
                }} onClick={e => { e.preventDefault(); navigate('register'); }}>
                  Register
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
          }}
          className="hamburger-btn"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '25px', height: '2px',
              background: '#d4a574',
              transition: 'all 0.3s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 1 ? 'opacity: 0' : 'rotate(-45deg) translate(5px, -5px)'
                : 'none',
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15,28,46,0.98)',
          borderTop: '1px solid #2d4563',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}>
          {[{ label: 'Home', page: 'home' }, { label: 'Library', page: 'library' }, { label: 'Contact', page: 'contact' }].map(item => (
            <a key={item.page} href={`#${item.page}`}
              style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
              onClick={e => { e.preventDefault(); navigate(item.page); setMenuOpen(false); }}
            >{item.label}</a>
          ))}
          {user ? (
            <>
              <a href="#profile" style={{ color: '#d4a574', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('profile'); setMenuOpen(false); }}>
                My Profile
              </a>
              <a href="#logout" style={{ color: '#e74c3c', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <>
              <a href="#login" style={{ color: '#d4a574', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('login'); setMenuOpen(false); }}>Login</a>
              <a href="#register" style={{ color: '#f4d03f', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('register'); setMenuOpen(false); }}>Register</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
