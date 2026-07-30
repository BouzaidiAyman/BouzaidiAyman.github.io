import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import { useToast } from './hooks/useToast';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';

type Page = 'home' | 'login' | 'register' | 'library' | 'profile' | 'contact' | 'about';

const VALID_PAGES = ['home', 'login', 'register', 'library', 'profile', 'contact', 'about'];

function AppInner() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.slice(1) as Page;
    return (VALID_PAGES.includes(hash) ? hash : 'home') as Page;
  });
  const { toast, show: showToast } = useToast();

  const navigate = useCallback((page: string) => {
    const valid = VALID_PAGES.includes(page) ? page : 'home';
    setCurrentPage(valid as Page);
    window.history.pushState({ page: valid }, '', `#${valid}`);
  }, []);

  useEffect(() => {
    function onNavigate(e: Event) {
      navigate((e as CustomEvent).detail);
    }
    function onPopState() {
      const hash = window.location.hash.slice(1) as Page;
      const valid = VALID_PAGES.includes(hash) ? hash : 'home';
      setCurrentPage(valid as Page);
    }
    window.addEventListener('navigate', onNavigate);
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('navigate', onNavigate);
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigate]);

  function renderPage() {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage onSuccess={() => navigate('profile')} showToast={showToast} />;
      case 'register':
        return <RegisterPage onSuccess={() => navigate('login')} showToast={showToast} />;
      case 'library':
        return <LibraryPage showToast={showToast} navigate={navigate} />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      case 'contact':
        return <ContactPage showToast={showToast} />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage />;
    }
  }

  return (
    <div>
      <Navbar currentPage={currentPage} navigate={navigate} showToast={showToast} />
      <div style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
        {renderPage()}
      </div>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      {currentPage === 'library' && user && <ChatWidget />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
