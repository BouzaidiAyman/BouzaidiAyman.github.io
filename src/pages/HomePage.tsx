import { Link } from './Router';

export function HomePage() {
  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2a1d13',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.16,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90' viewBox='0 0 90 90'%3E%3Cg fill='none' stroke='%23c9a35a' stroke-width='1'%3E%3Crect x='25' y='25' width='40' height='40'/%3E%3Crect x='25' y='25' width='40' height='40' transform='rotate(45 45 45)'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '90px 90px',
          animation: 'patternFloat 25s ease-in-out infinite',
        }} />
        <div style={{
          textAlign: 'center',
          color: '#fff',
          zIndex: 1,
          maxWidth: '900px',
          padding: '0 2rem',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.2rem',
            opacity: 0,
            animation: 'glowSlideUp 0.8s ease 0.05s forwards',
          }}>
            <span style={{ color: '#c9a35a', fontSize: '0.9rem' }}>◆</span>
            <span style={{
              fontFamily: "'UnifrakturCook', cursive",
              fontSize: '1.6rem',
              color: '#e8c07d',
              textShadow: '0 0 18px rgba(201,163,90,0.4)',
            }}>club culturel</span>
            <span style={{ color: '#c9a35a', fontSize: '0.9rem' }}>◆</span>
          </div>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: 500,
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            color: '#c9a35a',
            opacity: 0,
            animation: 'glowSlideUp 0.8s ease 0.2s forwards',
          }}>NIGHT OF OPEN KNOWLEDGE</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            opacity: 0,
            animation: 'glowSlideUp 0.8s ease 0.4s forwards',
            background: 'linear-gradient(135deg, #fff 0%, #c9a35a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Discover, Read, Watch & Share</h1>
          <p style={{
            fontSize: '1.4rem',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            opacity: 0,
            animation: 'glowSlideUp 0.8s ease 0.6s forwards',
            color: 'rgba(255,255,255,0.9)',
          }}>
            Join our vibrant community . Access our curated library
            of books, movies, and series. Rate, review, and connect with fellow members.
          </p>
          <div style={{
            display: 'inline-flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: 0,
            animation: 'glowSlideUp 0.8s ease 0.8s forwards',
          }}>
            <Link page="library" className="btn btn-primary">Explore Library</Link>
            <Link page="register" className="btn btn-secondary">Join Now</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '5rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #fff 0%, #c9a35a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Why Join Our Community?</h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto' }}>
            Experience knowledge in all its forms with like-minded individuals
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
        }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'inline-block' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', marginBottom: '1rem', color: '#fff' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: '📚', title: 'Curated Library', desc: 'Access our carefully selected collection of books, movies, and series. From classics to contemporary works, discover content that inspires.' },
  { icon: '⭐', title: 'Rate & Review', desc: 'Share your thoughts and ratings. Help the community discover great content through your honest reviews and recommendations.' },
  { icon: '👥', title: 'Community', desc: 'Connect with fellow culture enthusiasts. Engage in discussions, share insights, and build lasting friendships.' },
  { icon: '📊', title: 'Track Progress', desc: 'Keep track of your reading and watching journey. View your personal statistics and celebrate your knowledge exploration.' },
  { icon: '🎭', title: 'Monthly Events', desc: 'Participate in exclusive monthly events, discussions, and other activities designed for engaged members.' },
  { icon: '💎', title: 'Member Benefits', desc: 'Enjoy exclusive member benefits including early access to new content, special recommendations, and priority event registration.' },
];