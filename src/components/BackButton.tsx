import { ArrowLeft } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function BackButton() {
  const { goBack, screen, screenHistory } = useApp();

  if (screen === 'main' || screenHistory.length === 0) {
    return null;
  }

  return (
    <button
      onClick={goBack}
      className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
    >
      <ArrowLeft size={20} />
      <span className="font-medium">رجوع</span>
    </button>
  );
}
