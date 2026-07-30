import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { supabase, Item } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Stage = 'menu' | 'rec_type' | 'collect_bug' | 'collect_missing' | 'collect_suggestion';

interface Option {
  label: string;
  value: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: Option[];
}

const MENU_OPTIONS: Option[] = [
  { label: '🎬 Recommend something', value: 'menu:recommend' },
  { label: '🐛 Report a bug', value: 'menu:bug' },
  { label: '📚 Request a missing title', value: 'menu:missing' },
  { label: '💡 Suggestion / feedback', value: 'menu:suggestion' },
];

const TYPE_OPTIONS: Option[] = [
  { label: '📚 Book', value: 'type:book' },
  { label: '🎬 Movie', value: 'type:movie' },
  { label: '📺 Series', value: 'type:series' },
  { label: '🎲 Surprise me', value: 'type:any' },
];

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the NOOK assistant. I can recommend something from our library, or pass along a bug report, a missing title, or a suggestion to the team. What would you like to do?",
  options: MENU_OPTIONS,
};

const STOPWORDS = new Set([
  'a', 'an', 'the', 'of', 'and', 'me', 'my', 'i', 'to', 'for', 'some', 'any',
  'please', 'recommend', 'recommendation', 'suggest', 'something', 'movie',
  'movies', 'book', 'books', 'series', 'film', 'films', 'watch', 'read',
  'good', 'nice', 'best', 'give', 'want', 'like', 'can', 'you', 'is', 'it',
]);

const BUG_WORDS = ['bug', 'error', 'broken', 'crash', "doesn't work", 'not working', 'issue', 'problem', 'glitch', 'fails', "can't login", 'login issue', 'bogué', 'erreur', 'problème', 'ne fonctionne pas', 'cassé', 'plante'];
const MISSING_WORDS = ['add', 'missing', "don't have", "isn't in", 'not in your library', 'please add', 'can you add', 'ajouter', 'manque', "n'avez pas", "pouvez-vous ajouter"];
const SUGGESTION_WORDS = ['suggestion', 'feedback', 'idea', 'would be cool', 'would be nice', 'improve', 'suggestion', 'idée', 'amélioration', 'ce serait bien'];
const RECOMMEND_WORDS = ['recommend', 'suggest me', 'what should i', 'looking for', 'something to watch', 'something to read', 'recommande', 'conseille', 'quoi regarder', 'quoi lire'];
const TYPE_WORDS: Record<string, 'book' | 'movie' | 'series'> = {
  book: 'book', books: 'book', livre: 'book', livres: 'book',
  movie: 'movie', movies: 'movie', film: 'movie', films: 'movie',
  series: 'series', show: 'series', shows: 'series', série: 'series', séries: 'series',
};

function classify(text: string): 'bug' | 'missing' | 'suggestion' | 'recommend' | null {
  const t = text.toLowerCase();
  if (BUG_WORDS.some(w => t.includes(w))) return 'bug';
  if (MISSING_WORDS.some(w => t.includes(w))) return 'missing';
  const hasType = Object.keys(TYPE_WORDS).some(w => t.includes(w));
  if (hasType && (RECOMMEND_WORDS.some(w => t.includes(w)) || t.includes('?'))) return 'recommend';
  if (SUGGESTION_WORDS.some(w => t.includes(w))) return 'suggestion';
  if (RECOMMEND_WORDS.some(w => t.includes(w)) || hasType) return 'recommend';
  return null;
}

function detectType(text: string): 'book' | 'movie' | 'series' | null {
  const t = text.toLowerCase();
  for (const word of Object.keys(TYPE_WORDS)) {
    if (t.includes(word)) return TYPE_WORDS[word];
  }
  return null;
}

function pickRecommendations(items: Item[], type: string, queryText: string, exclude: Set<string>): Item[] {
  const pool = (type === 'any' ? items : items.filter(i => i.type === type)).filter(i => !exclude.has(i.id));
  if (pool.length === 0) return [];

  const words = queryText
    .toLowerCase()
    .split(/[^a-z0-9']+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  const scored = pool.map(item => {
    const haystack = `${item.title} ${item.author} ${item.description}`.toLowerCase();
    const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
    return { item, score: score + Math.random() * 0.5 };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(s => s.item);
}

function formatRecommendations(items: Item[]): string {
  if (items.length === 0) return "";
  return items
    .map(i => `${i.icon || '•'} "${i.title}"${i.author ? ` — ${i.author}` : ''}`)
    .join('\n');
}

export function ChatWidget() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<Stage>('menu');
  const [pendingType, setPendingType] = useState<string>('any');
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<Item[]>([]);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from('items')
      .select('*')
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  function addAssistant(content: string, options?: Option[]) {
    setMessages(prev => [...prev, { role: 'assistant', content, options }]);
  }

  function addUser(content: string) {
    setMessages(prev => [...prev, { role: 'user', content }]);
  }

  function backToMenu(intro = "Anything else I can help with?") {
    setStage('menu');
    addAssistant(intro, MENU_OPTIONS);
  }

  async function logFeedback(type: 'bug' | 'missing_title' | 'suggestion', message: string) {
    setSaving(true);
    const { error } = await supabase.from('feedback').insert({
      type,
      message,
      user_id: user?.id ?? null,
      user_name: profile?.name ?? null,
    });
    setSaving(false);
    if (error) {
      console.error('Failed to log feedback:', error);
      addAssistant("Hmm, I couldn't save that — please try again in a moment, or use the Contact page.");
      return false;
    }
    return true;
  }

  function showRecommendations(type: string, queryText: string) {
    const picks = pickRecommendations(items, type, queryText, shownIds);
    if (picks.length === 0) {
      addAssistant(
        "I couldn't find anything else matching that in our library right now. Want to request it be added?",
        [
          { label: '📚 Request this title', value: 'menu:missing' },
          { label: '⬅ Back to menu', value: 'menu:back' },
        ],
      );
      setStage('menu');
      return;
    }
    setShownIds(prev => new Set([...prev, ...picks.map(p => p.id)]));
    addAssistant(`Here's what I'd suggest:\n\n${formatRecommendations(picks)}`, [
      { label: '🔁 Show me more', value: `more:${type}` },
      { label: '⬅ Back to menu', value: 'menu:back' },
    ]);
  }

  async function handleOption(opt: Option) {
    addUser(opt.label);

    if (opt.value === 'menu:back') {
      backToMenu();
      return;
    }
    if (opt.value === 'menu:recommend') {
      setStage('rec_type');
      addAssistant('What are you in the mood for?', TYPE_OPTIONS);
      return;
    }
    if (opt.value === 'menu:bug') {
      setStage('collect_bug');
      addAssistant('Sorry about that! Describe the problem in a few words and I\'ll pass it to the team.');
      return;
    }
    if (opt.value === 'menu:missing') {
      setStage('collect_missing');
      addAssistant('What title should we add? (Feel free to include the author/director too.)');
      return;
    }
    if (opt.value === 'menu:suggestion') {
      setStage('collect_suggestion');
      addAssistant("I'm listening — what's your suggestion?");
      return;
    }
    if (opt.value.startsWith('type:')) {
      const type = opt.value.slice('type:'.length);
      setPendingType(type);
      showRecommendations(type, '');
      return;
    }
    if (opt.value.startsWith('more:')) {
      const type = opt.value.slice('more:'.length);
      showRecommendations(type, '');
      return;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || saving) return;
    setInput('');
    addUser(text);

    if (stage === 'collect_bug') {
      const ok = await logFeedback('bug', text);
      if (ok) backToMenu('Thanks — logged for the team! Anything else?');
      return;
    }
    if (stage === 'collect_missing') {
      const ok = await logFeedback('missing_title', text);
      if (ok) backToMenu("Got it — I've passed the request along! Anything else?");
      return;
    }
    if (stage === 'collect_suggestion') {
      const ok = await logFeedback('suggestion', text);
      if (ok) backToMenu('Thanks for the feedback! Anything else?');
      return;
    }
    if (stage === 'rec_type') {
      const detected = detectType(text) || pendingType;
      showRecommendations(detected, text);
      return;
    }

    // stage === 'menu': try to guess intent from free text
    const intent = classify(text);
    if (intent === 'bug') {
      const ok = await logFeedback('bug', text);
      if (ok) backToMenu("Sorry about that — logged for the team! Anything else?");
      return;
    }
    if (intent === 'missing') {
      const ok = await logFeedback('missing_title', text);
      if (ok) backToMenu("Got it — I've passed the request along! Anything else?");
      return;
    }
    if (intent === 'suggestion') {
      const ok = await logFeedback('suggestion', text);
      if (ok) backToMenu('Thanks for the feedback! Anything else?');
      return;
    }
    if (intent === 'recommend') {
      const type = detectType(text) || 'any';
      setPendingType(type);
      setStage('menu');
      showRecommendations(type, text);
      return;
    }

    addAssistant("I'm a simple menu-based assistant, so I might've missed that — here's what I can help with:", MENU_OPTIONS);
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        className="chat-fab"
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)',
          color: '#17100b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(201,163,90,0.5)',
          zIndex: 1200,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {open && (
        <div
          className="chat-panel"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '1.75rem',
            width: '360px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 9rem)',
            background: '#2a1d13',
            border: '2px solid #4a3420',
            borderRadius: '18px',
            boxShadow: '0 20px 60px rgba(23,16,11,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1200,
          }}
        >
          <div
            style={{
              padding: '1.1rem 1.4rem',
              background: 'linear-gradient(135deg, #5c4020 0%, #2a1d13 100%)',
              borderBottom: '2px solid #c9a35a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} color="#17100b" />
            </div>
            <div>
              <div style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', lineHeight: 1.2 }}>
                NOOK Assistant
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                Recommendations · Feedback · Bug reports
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.1rem 1.1rem 0.5rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '0.65rem 0.95rem',
                      borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: m.role === 'user' ? 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)' : '#17100b',
                      color: m.role === 'user' ? '#17100b' : 'rgba(255,255,255,0.92)',
                      border: m.role === 'user' ? 'none' : '1px solid #4a3420',
                      fontSize: '0.98rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
                {m.role === 'assistant' && m.options && i === messages.length - 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.6rem' }}>
                    {m.options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleOption(opt)}
                        style={{
                          padding: '0.45rem 0.9rem',
                          borderRadius: '16px',
                          border: '1px solid #c9a35a',
                          background: 'transparent',
                          color: '#c9a35a',
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          fontFamily: "'Cormorant Garamond', serif",
                          transition: 'all 0.2s ease',
                        }}
                        className="chat-option-btn"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {saving && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.8rem' }}>
                <div style={{ padding: '0.65rem 0.95rem', borderRadius: '14px 14px 14px 2px', background: '#17100b', border: '1px solid #4a3420', display: 'flex', gap: '4px' }}>
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                  <span className="chat-dot" />
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '0.6rem',
              padding: '0.9rem',
              borderTop: '1px solid #4a3420',
              background: '#1f150e',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type here or use the buttons above…"
              disabled={saving}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: '20px',
                border: '1px solid #4a3420',
                background: '#17100b',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: "'Cormorant Garamond', serif",
              }}
            />
            <button
              type="submit"
              disabled={saving || !input.trim()}
              aria-label="Send message"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: 'none',
                cursor: saving || !input.trim() ? 'not-allowed' : 'pointer',
                background: saving || !input.trim() ? '#4a3420' : 'linear-gradient(135deg, #c9a35a 0%, #e8c07d 100%)',
                color: '#17100b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}