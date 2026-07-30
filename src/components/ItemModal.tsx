import { useState, useEffect, useRef, FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
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
    image_url?: string | null;
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

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadComments();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [item.id]);

  async function loadComments() {
    const { data: rows, error } = await supabase
      .from('comments')
      .select('*')
      .eq('item_id', item.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load comments:', error);
      showToast('Could not load comments', 'error');
      return;
    }
    if (!rows) {
      setComments([]);
      return;
    }

    const userIds = [...new Set(rows.map(r => r.user_id))];
    let namesById: Record<string, string> = {};

    if (userIds.length > 0) {
      const { data: profileRows, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);
      if (profileError) {
        console.error('Failed to load commenter names:', profileError);
      } else if (profileRows) {
        namesById = Object.fromEntries(profileRows.map(p => [p.id, p.name]));
      }
    }

    setComments(
      rows.map(r => ({ ...r, profiles: { name: namesById[r.user_id] ?? 'Member' } })) as any
    );
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
        position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0,
        background: 'rgba(23,16,11,0.85)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.75rem, 4vw, 2rem)',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          background: '#17100b',
          border: '2px solid #c9a35a',
          borderRadius: '20px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: 'calc(100vh - 80px - 4rem)',
          overflowY: 'auto',
          position: 'relative',
          animation: 'modalSlideUp 0.4s ease',
        }}>
        <div style={{ position: 'sticky', top: 0, height: 0, zIndex: 10 }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '1.1rem', right: '1.1rem',
              background: '#c9a35a', color: '#17100b',
              border: 'none', width: '38px', height: '38px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08) rotate(90deg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
          ><X size={18} strokeWidth={2.5} /></button>
        </div>

        {/* Poster + details */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.8rem', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.5rem, 4vw, 2.5rem) 0' }}>
          <div style={{
            width: '150px',
            aspectRatio: '2 / 3',
            flexShrink: 0,
            background: item.image_url ? '#120c08' : 'linear-gradient(135deg, #5c4020 0%, #c9a35a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem', borderRadius: '14px',
            overflow: 'hidden',
            border: '1px solid #4a3420',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              item.icon
            )}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#c9a35a', marginBottom: '0.6rem', fontWeight: 600 }}>
              {item.type}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff', marginBottom: '0.4rem', lineHeight: 1.25 }}>
              {item.title}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginBottom: '1.1rem' }}>
              by {item.author}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexWrap: 'wrap' }}>
              <Stars rating={item.avgRating} size="1.25rem" />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>{item.avgRating.toFixed(1)} ({item.ratingCount} ratings)</span>
            </div>
          </div>
        </div>

        <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '1.5rem' }}>
            {item.description}
          </p>

          {/* Rating & List section */}
          {user ? (
            <div style={{
              borderTop: '1px solid #4a3420',
              paddingTop: '1.8rem',
              marginBottom: '1.8rem',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#fff', marginBottom: '1rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
              }}>
                Your Rating
                <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #4a3420, transparent)' }} />
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.4rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => onRate(item.id, star)}
                    style={{
                      fontSize: '2rem',
                      cursor: 'pointer',
                      color: star <= displayRating ? '#c9a35a' : '#4a3420',
                      filter: star <= displayRating ? 'drop-shadow(0 0 5px rgba(201,163,90,0.6))' : 'none',
                      transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1), color 0.18s ease',
                      transform: star <= displayRating ? 'scale(1.12)' : 'scale(1)',
                      display: 'inline-block',
                    }}
                  >★</span>
                ))}
              </div>
              <button
                onClick={handleAddToList}
                disabled={addingToList}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.6rem', fontSize: '0.98rem' }}
              >
                {addingToList ? 'Adding...' : `Add to My ${typeLabel}`}
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', margin: '1.5rem 0', color: 'rgba(255,255,255,0.7)' }}>
              <button
                onClick={() => { navigate('login'); onClose(); }}
                style={{ background: 'none', border: 'none', color: '#c9a35a', cursor: 'pointer', fontSize: '1rem', textDecoration: 'underline' }}
              >Login</button>
              {' '}to rate and add to your profile
            </p>
          )}

          {/* Comments */}
          <div style={{ borderTop: '1px solid #4a3420', paddingTop: '1.8rem' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#fff', marginBottom: '1.4rem',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              Comments
              <span style={{
                background: 'rgba(201,163,90,0.15)', color: '#c9a35a',
                fontSize: '0.85rem', fontFamily: "'Cormorant Garamond', serif",
                padding: '0.1rem 0.65rem', borderRadius: '20px', fontWeight: 600,
              }}>{comments.length}</span>
              <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #4a3420, transparent)' }} />
            </h3>

            {user && (
              <form onSubmit={handleComment} style={{ marginBottom: '1.8rem' }}>
                <textarea
                  value={commentBody}
                  onChange={e => setCommentBody(e.target.value)}
                  placeholder="Share your thoughts..."
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    fontSize: '1rem',
                    fontFamily: "'Cormorant Garamond', serif",
                    border: '2px solid #4a3420',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#fff',
                    resize: 'vertical',
                    minHeight: '90px',
                    marginBottom: '0.8rem',
                    outline: 'none',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#c9a35a'; e.target.style.boxShadow = '0 0 0 3px rgba(201,163,90,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = '#4a3420'; e.target.style.boxShadow = 'none'; }}
                  required
                />
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.98rem' }}>
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {comments.length === 0 && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                  No comments yet. Be the first!
                </p>
              )}
              {comments.map(c => {
                const name = c.profiles?.name ?? 'Member';
                return (
                  <div key={c.id} className="comment-card" style={{
                    background: 'rgba(255,255,255,0.035)',
                    border: '1px solid #4a3420',
                    borderRadius: '12px',
                    padding: '1rem 1.2rem',
                    display: 'flex',
                    gap: '0.9rem',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #5c4020 0%, #c9a35a 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#17100b', fontSize: '1rem',
                    }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: 600, color: '#c9a35a', fontSize: '0.98rem' }}>{name}</span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginLeft: '0.7rem' }}>
                            {new Date(c.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {user && user.id === c.user_id && (
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            aria-label="Delete comment"
                            className="comment-delete-btn"
                            style={{
                              background: 'none', border: 'none',
                              color: 'rgba(231,76,60,0.75)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center',
                              padding: '0.2rem', flexShrink: 0,
                              transition: 'color 0.2s ease',
                            }}
                          ><Trash2 size={15} /></button>
                        )}
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontSize: '0.98rem' }}>{c.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
