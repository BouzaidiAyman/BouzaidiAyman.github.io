import { useState, useEffect, FormEvent } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Comment } from '../lib/supabase';
import { Stars } from '../pages/LibraryPage';

interface ItemModalProps {
  item: {
    id: string;
    type: string;
    title: string;
    author: string;
    description: string;
    icon: string;
    avgRating: number;
    ratingCount: number;
    userRating: number;
  };
  onClose: () => void;
  onRate: (itemId: string, score: number) => void;
  user: User | null;
  navigate: (page: string) => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function ItemModal({ item, onClose, onRate, user, navigate, showToast }: ItemModalProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comments, setComments] = useState<(Comment & { profiles: { name: string } | null })[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  useEffect(() => {
    loadComments();
  }, [item.id]);

  async function loadComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name)')
      .eq('item_id', item.id)
      .order('created_at', { ascending: false });
    if (data) setComments(data as any);
  }

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('comments').insert({ item_id: item.id, body: commentBody.trim() });
    setSubmitting(false);
    if (error) {
      showToast('Failed to post comment', 'error');
    } else {
      setCommentBody('');
      showToast('Comment posted!', 'success');
      loadComments();
    }
  }

  async function handleDeleteComment(commentId: string) {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) { showToast('Failed to delete comment', 'error'); return; }
    setComments(prev => prev.filter(c => c.id !== commentId));
    showToast('Comment deleted', 'success');
  }

  async function handleAddToList() {
    if (!user) { navigate('login'); onClose(); return; }
    setAddingToList(true);
    const { error } = await supabase.from('user_lists').insert({ item_id: item.id });
    setAddingToList(false);
    if (error) {
      if (error.code === '23505') {
        showToast('Already in your list', 'error');
      } else {
        showToast('Failed to add to list', 'error');
      }
    } else {
      showToast(`Added to your ${item.type} list!`, 'success');
    }
  }

  const typeLabel = item.type === 'book' ? 'Reading List' : 'Watched List';
  const displayRating = hoveredStar || item.userRating;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,28,46,0.85)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{
        background: '#0f1c2e',
        border: '2px solid #d4a574',
        borderRadius: '20px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        animation: 'modalSlideUp 0.4s ease',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem',
            background: '#d4a574', color: '#0f1c2e',
            border: 'none', width: '35px', height: '35px',
            borderRadius: '50%', fontSize: '1.3rem',
            cursor: 'pointer', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.3s ease',
            fontWeight: 700, lineHeight: 1,
          }}
        >×</button>

        {/* Header image */}
        <div style={{
          width: '100%', height: '250px',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #d4a574 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '6rem', borderRadius: '18px 18px 0 0',
        }}>
          {item.icon}
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#d4a574', marginBottom: '0.5rem' }}>
            {item.type}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>
            {item.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            by {item.author}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {item.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
            <Stars rating={item.avgRating} size="1.3rem" />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.avgRating.toFixed(1)} ({item.ratingCount} ratings)</span>
          </div>

          {/* Rating & List section */}
          {user ? (
            <div style={{
              borderTop: '1px solid #2d4563',
              paddingTop: '2rem',
              marginBottom: '2rem',
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '1rem' }}>
                Your Rating
              </h3>
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => onRate(item.id, star)}
                    style={{
                      fontSize: '2.2rem',
                      cursor: 'pointer',
                      color: star <= displayRating ? '#d4a574' : '#2d4563',
                      filter: star <= displayRating ? 'drop-shadow(0 0 4px #d4a574)' : 'none',
                      transition: 'all 0.15s ease',
                      transform: star <= displayRating ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >★</span>
                ))}
              </div>
              <button
                onClick={handleAddToList}
                disabled={addingToList}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}
              >
                {addingToList ? 'Adding...' : `Add to My ${typeLabel}`}
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', margin: '1.5rem 0', color: 'rgba(255,255,255,0.7)' }}>
              <button
                onClick={() => { navigate('login'); onClose(); }}
                style={{ background: 'none', border: 'none', color: '#d4a574', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }}
              >Login</button>
              {' '}to rate and add to your profile
            </p>
          )}

          {/* Comments */}
          <div style={{ borderTop: '1px solid #2d4563', paddingTop: '2rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem' }}>
              Comments ({comments.length})
            </h3>

            {user && (
              <form onSubmit={handleComment} style={{ marginBottom: '1.5rem' }}>
                <textarea
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  placeholder="Share your thoughts..."
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    fontSize: '1rem',
                    fontFamily: "'Cormorant Garamond', serif",
                    border: '2px solid #2d4563',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    resize: 'vertical',
                    minHeight: '100px',
                    marginBottom: '0.8rem',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#d4a574')}
                  onBlur={e => (e.target.style.borderColor = '#2d4563')}
                  required
                />
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comments.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>No comments yet. Be the first!</p>
              )}
              {comments.map(c => (
                <div key={c.id} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #2d4563',
                  borderRadius: '10px',
                  padding: '1rem 1.2rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#d4a574', fontSize: '1rem' }}>
                        {c.profiles?.name ?? 'Anonymous'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginLeft: '0.8rem' }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {user && user.id === c.user_id && (
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#e74c3c', cursor: 'pointer',
                          fontSize: '0.9rem', opacity: 0.7,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
                      >Delete</button>
                    )}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontSize: '1rem' }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
