import { useApp } from '../store/AppContext';

export function Header() {
  const { operationCount, settings, screen } = useApp();

  if (screen === 'admin' || screen === 'admin-games' || screen === 'admin-events' || screen === 'admin-settings') {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-4 px-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-lg">
            {operationCount}
          </div>
          <span className="text-slate-400 text-sm">
            / {settings?.max_operations_per_user || 10}
          </span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          منصة العمليات
        </h1>
      </div>
    </header>
  );
}
