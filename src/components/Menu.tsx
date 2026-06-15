import { Menu as MenuIcon, X, Home } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Menu() {
  const { menuOpen, setMenuOpen, navigateTo, screen } = useApp();

  return (
    <>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700 transition-all duration-300"
      >
        {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-slate-900 to-slate-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <h2 className="text-white text-xl font-bold mb-6 border-b border-slate-700 pb-4">
            القائمة
          </h2>

          <nav className="space-y-2">
            <button
              onClick={() => {
                navigateTo('main');
                setMenuOpen(false);
              }}
              className={`w-full text-right px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                screen === 'main'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Home size={20} />
              <span>البداية - الرئيسية</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
