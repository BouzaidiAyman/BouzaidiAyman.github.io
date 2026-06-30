interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export function Toast({ message, type, visible }: ToastProps) {
  const borderColor = type === 'error' ? '#e74c3c' : '#d4a574';
  const bg = type === 'error' ? '#c0392b' : '#1e3a5f';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: bg,
        color: '#fff',
        padding: '1rem 2rem',
        borderRadius: '10px',
        border: `2px solid ${borderColor}`,
        boxShadow: '0 5px 20px rgba(212,165,116,0.4)',
        transform: visible ? 'translateY(0)' : 'translateY(150%)',
        transition: 'transform 0.4s ease',
        zIndex: 3000,
        fontSize: '1.05rem',
        fontFamily: "'Cormorant Garamond', serif",
        maxWidth: '340px',
      }}
    >
      {message}
    </div>
  );
}
