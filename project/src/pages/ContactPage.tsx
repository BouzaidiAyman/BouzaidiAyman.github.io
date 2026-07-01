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

  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards', maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          background: 'linear-gradient(135deg, #fff 0%, #d4a574 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
        }}>Get In Touch</h1>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.7)' }}>We'd love to hear from you</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
        {/* Info */}
        <div style={{
          background: '#1a2942',
          border: '2px solid #2d4563',
          borderRadius: '16px',
          padding: '2.5rem',
        }}>
          {[
            { icon: '📧', title: 'Email', text: 'culturalclub@university.edu' },
            { icon: '📍', title: 'Location', text: 'Student Center, Room 301\nUniversity Campus' },
            { icon: '🕐', title: 'Office Hours', text: 'Monday – Friday\n9:00 AM – 5:00 PM' },
          ].map((info, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? '2rem' : 0 }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{info.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>
                {info.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{info.text}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{
          background: '#1a2942',
          border: '2px solid #2d4563',
          borderRadius: '16px',
          padding: '2.5rem',
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
        </div>
      </div>
    </div>
  );
}
