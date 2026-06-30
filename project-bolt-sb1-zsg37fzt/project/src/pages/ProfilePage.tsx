import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Item } from '../lib/supabase';
import { Link } from './Router';

interface ProfilePageProps {
  navigate?: (page: string) => void;
}

interface ListEntry {
  id: string;
  added_at: string;
  items: Item;
}

export function ProfilePage(_props: ProfilePageProps) {
  const { user, profile, loading } = useAuth();
  const [listItems, setListItems] = useState<ListEntry[]>([]);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadUserData();
  }, [user]);

  async function loadUserData() {
    if (!user) return;
    setDataLoading(true);
    const [listRes, ratingsRes] = await Promise.all([
      supabase.from('user_lists').select('*, items(*)').eq('user_id', user.id).order('added_at', { ascending: false }),
      supabase.from('ratings').select('id', { count: 'exact' }).eq('user_id', user.id),
    ]);
    if (listRes.data) setListItems(listRes.data as any);
    if (ratingsRes.count !== null) setRatingsCount(ratingsRes.count);
    setDataLoading(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem' }}>
      Loading...
    </div>
  );

  if (!user || !profile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>You need to be logged in to view your profile.</p>
        <Link page="login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  const initials = profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const books = listItems.filter(e => e.items?.type === 'book');
  const movies = listItems.filter(e => e.items?.type === 'movie');
  const series = listItems.filter(e => e.items?.type === 'series');

  return (
    <div style={{ opacity: 0, animation: 'fadeIn 0.6s ease forwards' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 5rem' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%)',
          border: '2px solid #d4a574',
          color: '#fff',
          padding: '3rem 2rem',
          borderRadius: '20px',
          marginBottom: '3rem',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(212,165,116,0.2)',
        }}>
          <div style={{
            width: '120px', height: '120px',
            background: 'linear-gradient(135deg, #d4a574, #f4d03f)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#0f1c2e',
            border: '4px solid rgba(255,255,255,0.3)',
          }}>
            {initials}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {profile.name}
          </h1>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>{user.email}</p>
          <p style={{ opacity: 0.6, fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Member since {new Date(profile.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {[
            { num: books.length, label: 'Books Read' },
            { num: movies.length, label: 'Movies Watched' },
            { num: series.length, label: 'Series Watched' },
            { num: ratingsCount, label: 'Ratings Given' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#1a2942',
              border: '2px solid #2d4563',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              transition: 'border-color 0.3s, transform 0.3s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#d4a574'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2d4563'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#d4a574', marginBottom: '0.5rem' }}>
                {dataLoading ? '—' : s.num}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Lists */}
        {dataLoading ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '2rem' }}>Loading your lists...</div>
        ) : listItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your profile is empty — start exploring!</p>
            <Link page="library" className="btn btn-primary">Go to Library</Link>
          </div>
        ) : (
          <>
            {books.length > 0 && <ListSection title="My Reading List" items={books} />}
            {movies.length > 0 && <ListSection title="Movies I've Watched" items={movies} />}
            {series.length > 0 && <ListSection title="Series I've Watched" items={series} />}
          </>
        )}
      </div>
    </div>
  );
}

function ListSection({ title, items }: { title: string; items: ListEntry[] }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '2rem',
        color: '#fff',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #d4a574',
      }}>{title}</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem',
      }}>
        {items.map(entry => (
          <div key={entry.id} style={{
            background: '#1a2942',
            border: '2px solid #2d4563',
            padding: '1.5rem',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#d4a574'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#2d4563'; }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>{entry.items?.icon}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>
              {entry.items?.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              {entry.items?.type} · {entry.items?.author}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
              Added {new Date(entry.added_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
