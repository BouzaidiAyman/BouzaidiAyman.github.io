import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Import your custom circular logo asset from the icons folder
import culturelLogo from '../pages/icon/nook2.png';

interface NavbarProps {
  currentPage: string;
  navigate: (page: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function Navbar({ currentPage, navigate, showToast }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredPage, setHoveredPage] = useState<string | null>(null);

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

  // Base navigation text styles with brown theme (#c9a35a) and hover/active tracking
  const navLinkStyle = (page: string): React.CSSProperties => ({
    textDecoration: 'none',
    color: currentPage === page || hoveredPage === page ? '#c9a35a' : '#fff',
    fontSize: '1.1rem',
    fontWeight: 500,
    opacity: currentPage === page || hoveredPage === page ? 1 : 0.9,
    transition: 'all 0.3s ease',
    fontFamily: "'Cormorant Garamond', serif",
    cursor: 'pointer',
    position: 'relative',
    padding: '0.5rem 0',
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%',
      background: scrolled ? 'rgba(23,16,11,0.98)' : 'rgba(23,16,11,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '2px solid #c9a35a',
      zIndex: 1000,
      transition: 'all 0.4s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(23,16,11,0.3)' : 'none',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo Section with Image */}
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
          <img 
            src={culturelLogo} 
            alt="Cultural Club Logo" 
            style={{ 
              height: '2.5rem', 
              width: '2.5rem', 
              objectFit: 'cover', 
              borderRadius: '50%', 
              border: '1px solid #c9a35a', 
              boxShadow: '0 0 10px rgba(201,163,90,0.2)', 
              display: 'block' 
            }} 
          />
          <span>NOOK</span>
        </a>

        {/* Desktop nav with About button included & Hover Underline Animations */}
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
            { label: 'About', page: 'about' },
            { label: 'Contact', page: 'contact' },
          ].map(item => {
            const isActive = currentPage === item.page;
            const isHovered = hoveredPage === item.page;
            
            return (
              <li key={item.page} style={{ position: 'relative' }}>
                <a
                  href={`#${item.page}`}
                  style={navLinkStyle(item.page)}
                  onMouseEnter={() => setHoveredPage(item.page)}
                  onMouseLeave={() => setHoveredPage(null)}
                  onClick={e => { e.preventDefault(); navigate(item.page); }}
                >
                  {item.label}
                  
                  {/* The Underline Asset Container Animation */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: isActive || isHovered ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: '#c9a35a',
                    transition: 'width 0.3s ease',
                  }} />
                </a>
              </li>
            );
          })}
          
          {user ? (
            <>
              <li>
                <a href="#profile" style={{
                  ...navLinkStyle('profile'),
                  padding: '0.5rem 1.5rem',
                  border: '2px solid #c9a35a',
                  borderRadius: '25px',
                  color: '#c9a35a',
                }} onClick={e => { e.preventDefault(); navigate('profile'); }}>
                  {profile?.name?.split(' ')[0] || 'Profile'}
                </a>
              </li>
              <li>
                <a href="#logout" style={{
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)',
                  color: '#17100b',
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
                  border: '2px solid #c9a35a',
                  borderRadius: '25px',
                }} onClick={e => { e.preventDefault(); navigate('login'); }}>
                  Login
                </a>
              </li>
              <li>
                <a href="#register" style={{
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)',
                  color: '#17100b',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: 'all 0.3s',
                  display: 'inline-block',
                  boxShadow: '0 4px 15px rgba(201,163,90,0.4)',
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
              background: '#c9a35a',
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
          background: 'rgba(23,16,11,0.98)',
          borderTop: '1px solid #4a3420',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}>
          {[
            { label: 'Home', page: 'home' }, 
            { label: 'Library', page: 'library' }, 
            { label: 'About', page: 'about' }, 
            { label: 'Contact', page: 'contact' }
          ].map(item => (
            <a key={item.page} href={`#${item.page}`}
              style={{ color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
              onClick={e => { e.preventDefault(); navigate(item.page); setMenuOpen(false); }}
            >{item.label}</a>
          ))}
          {user ? (
            <>
              <a href="#profile" style={{ color: '#c9a35a', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('profile'); setMenuOpen(false); }}>
                My Profile
              </a>
              <a href="#logout" style={{ color: '#e74c3c', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={handleLogout}>Logout</a>
            </>
          ) : (
            <>
              <a href="#login" style={{ color: '#c9a35a', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('login'); setMenuOpen(false); }}>Login</a>
              <a href="#register" style={{ color: '#e8c07d', textDecoration: 'none', fontSize: '1.2rem', fontFamily: "'Cormorant Garamond', serif" }}
                onClick={e => { e.preventDefault(); navigate('register'); setMenuOpen(false); }}>Register</a>
            </>
          )}
        </div>
      )}
    </nav>
  );
}