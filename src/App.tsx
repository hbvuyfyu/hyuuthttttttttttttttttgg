import { AppProvider, useApp } from './store/AppContext';
import { Menu } from './components/Menu';
import { BackButton } from './components/BackButton';
import { Header } from './components/Header';
import { MainScreen } from './screens/MainScreen';
import { GameSelectScreen } from './screens/GameSelectScreen';
import { EventSelectScreen } from './screens/EventSelectScreen';
import { InfoFormScreen } from './screens/InfoFormScreen';
import { SuccessScreen, FailedScreen, LimitReachedScreen } from './screens/ResultScreens';
import { AdminHome, AdminGames, AdminEvents, AdminSettings } from './screens/AdminScreens';

function AppContent() {
  const { screen, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'main':
        return <MainScreen />;
      case 'game-select':
        return <GameSelectScreen />;
      case 'event-select':
        return <EventSelectScreen />;
      case 'info-form':
        return <InfoFormScreen />;
      case 'success':
        return <SuccessScreen />;
      case 'failed':
        return <FailedScreen />;
      case 'limit-reached':
        return <LimitReachedScreen />;
      case 'admin':
        return <AdminHome />;
      case 'admin-games':
        return <AdminGames />;
      case 'admin-events':
        return <AdminEvents />;
      case 'admin-settings':
        return <AdminSettings />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <div dir="rtl" className="font-sans">
      <Menu />
      <Header />
      {renderScreen()}
      <BackButton />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
