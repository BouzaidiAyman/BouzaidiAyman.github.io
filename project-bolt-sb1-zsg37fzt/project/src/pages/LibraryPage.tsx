import { useState, useEffect } from 'react';
import { supabase, Item, Rating } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ItemModal } from '../components/ItemModal';

type Filter = 'all' | 'book' | 'movie' | 'series';

interface LibraryPageProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
  navigate: (page: string) => void;
}

interface ItemWithStats extends Item {
  avgRating: number;
  ratingCount: number;
  userRating: number;
}

export function LibraryPage({ showToast, navigate }: LibraryPageProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ItemWithStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [itemsRes, ratingsRes] = await Promise.all([
      supabase.from('items').select('*').order('created_at'),
      supabase.from('ratings').select('*'),
    ]);
    if (itemsRes.data) setItems(itemsRes.data);
    if (ratingsRes.data) setRatings(ratingsRes.data);
    setLoading(false);
  }

  function getAvgRating(itemId: string) {
    const itemRatings = ratings.filter(r => r.item_id === itemId);
    if (!itemRatings.length) return 0;
    return itemRatings.reduce((sum, r) => sum + r.score, 0) / itemRatings.length;
  }

  function getUserRating(itemId: string) {
    if (!user) return 0;
    return ratings.find(r => r.item_id === itemId && r.user_id === user.id)?.score ?? 0;
  }

  function getRatingCount(itemId: string) {
    return ratings.filter(r => r.item_id === itemId).length;
  }

  function openModal(item: Item) {
    setSelectedItem({
      ...item,
      avgRating: getAvgRating(item.id),
      ratingCount: getRatingCount(item.id),
      userRating: getUserRating(item.id),
    });
  }

  async function handleRate(itemId: string, score: number) {
    if (!user) { navigate('login'); return; }
    const existing = ratings.find(r => r.item_id === itemId && r.user_id === user.id);
    if (existing) {
      const { error } = await supabase.from('ratings').update({ score }).eq('id', existing.id);
      if (error) { showToast('Failed to save rating', 'error'); return; }
      setRatings(prev => prev.map(r => r.id === existing.id ? { ...r, score } : r));
    } else {
      const { data, error } = await supabase.from('ratings').insert({ item_id: itemId, score }).select().maybeSingle();
      if (error) { showToast('Failed to save rating', 'error'); return; }
      if (data) setRatings(prev => [...prev, data]);
    }
    showToast('Rating saved!', 'success');
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, userRating: score, avgRating: getAvgRatingAfterUpdate(itemId, score), ratingCount: prev.userRating === 0 ? prev.ratingCount + 1 : prev.ratingCount } : null);
    }
  }

  function getAvgRatingAfterUpdate(itemId: string, newScore: number) {
    const others = ratings.filter(r => r.item_id === itemId && r.user_id !== user?.id);
    const total = others.reduce((sum, r) => sum + r.score, 0) + newScore;
    return total / (others.length + 1);
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem 0',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1a2942 100%)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '3rem',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(212,165,116,0.2), transparent)',
          animation: 'shimmer 3s infinite',
        }} />
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #d4a574 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          position: 'relative',
        }}>Our Library</h1>
        <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', position: 'relative' }}>
          Explore our collection of books, movies, and series
        </p>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['all', 'book', 'movie', 'series'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`filter-btn${filter === f ? ' active' : ''}`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
            Loading library...
          </div>
        ) : (
          <div className="items-grid">
            {filtered.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                avgRating={getAvgRating(item.id)}
                ratingCount={getRatingCount(item.id)}
                onClick={() => openModal(item)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRate={handleRate}
          user={user}
          navigate={navigate}
          showToast={showToast}
        />
      )}
    </div>
  );
}

function Stars({ rating, size = '1.1rem' }: { rating: number; size?: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: size,
          color: i <= Math.round(rating) ? '#d4a574' : '#2d4563',
          filter: i <= Math.round(rating) ? 'drop-shadow(0 0 2px #d4a574)' : 'none',
        }}>★</span>
      ))}
    </div>
  );
}

function ItemCard({ item, avgRating, ratingCount, onClick }: {
  item: Item;
  avgRating: number;
  ratingCount: number;
  onClick: () => void;
}) {
  return (
    <div className="item-card" onClick={onClick}>
      <div style={{
        width: '100%',
        height: '220px',
        background: 'linear-gradient(135deg, #1e3a5f 0%, #d4a574 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {item.icon}
      </div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#d4a574', marginBottom: '0.5rem', fontWeight: 600 }}>
          {item.type}
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', marginBottom: '1rem' }}>
          {item.author}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Stars rating={avgRating} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>({ratingCount})</span>
        </div>
      </div>
    </div>
  );
}

export { Stars };
