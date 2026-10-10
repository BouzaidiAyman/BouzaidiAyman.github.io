import { useState, FormEvent } from 'react';

interface ContactPageProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function ContactPage({ showToast }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    showToast('Message sent successfully!', 'success');
    setName('');
    setEmail('');
    setMessage('');
  }

  const contactInfo = [
    { type: 'image', icon: new URL('./icon/instagram.png', import.meta.url).href, title: 'Instagram', text: 'Our Instagram Page', link: 'https://www.instagram.com/culturel_ensam/' },
    { type: 'image', icon: new URL('./icon/facebook.png', import.meta.url).href, title: 'Facebook', text: 'Our Facebook Page', link: 'https://www.facebook.com/groups/culturelENSAM/' },
    { type: 'image', icon: new URL('./icon/linkedin.png', import.meta.url).href, title: 'LinkedIn', text: 'Our Linkedin Profile', link: 'https://www.linkedin.com/in/club-culturel-a6390628a/' },
    { type: 'image', icon: new URL('./icon/tik-tok.png', import.meta.url).href, title: 'TikTok', text: 'Our TikTok Page', link: 'https://www.tiktok.com/@culturel_ensam?_r=1&_t=ZS-9ARdgbJenzj' },
     { type: 'image', icon: new URL('./icon/location.png', import.meta.url).href, title: 'Location', text: 'ENSAM Meknès', link: '' },
  ];

  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          background: 'linear-gradient(135deg, #fff 0%, #c9a35a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
        }}>Get In Touch</h1>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)' }}>We'd love to hear from you</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Info & Socials Column */}
        <div style={{
          background: '#2a1d13',
          border: '2px solid #4a3420',
          borderRadius: '16px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {contactInfo.map((info, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2rem' }}>
                {info.type === 'image' ? (
                  <img 
                    src={info.icon} 
                    alt={info.title} 
                    style={{ width: '2.2rem', height: '2.2rem', objectFit: 'contain', flexShrink: 0, marginTop: '0.2rem', filter: 'invert(1)' }} 
                  />
                ) : (
                  <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{info.icon}</div>
                )}
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', color: '#fff', marginBottom: '0.3rem' }}>
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: '#c9a35a', textDecoration: 'none', fontSize: '1.05rem', wordBreak: 'break-all', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      {info.text}
                    </a>
                  ) : (
                    <p style={{ color: '#c9a35a', fontSize: '1.05rem', whiteSpace: 'pre-line', margin: 0 }}>{info.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
            Placeholder
          </div>
        </div>

        {/* Form Column */}
        <div style={{
          background: '#2a1d13',
          border: '2px solid #4a3420',
          borderRadius: '16px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="your.email@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-input"
                placeholder="How can we help you?"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                style={{ minHeight: '150px', resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full">Send Message</button>
          </form>

          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #4a3420', paddingTop: '1.5rem' }}>
            This website created by Wissal EL AATTARI and Ayman Bouzaidi.
          </p>
        </div>
      </div>
    </div>
  );
}
