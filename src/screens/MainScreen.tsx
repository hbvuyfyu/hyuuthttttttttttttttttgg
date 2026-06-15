import { Gamepad2, Settings } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function MainScreen() {
  const { navigateTo, operationCount, settings } = useApp();
  const maxOps = settings?.max_operations_per_user || 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Gamepad2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">مرحباً بك</h1>
          <p className="text-slate-400">اختر ما تريد القيام به</p>
        </div>

        <button
          onClick={() => {
            if (operationCount >= maxOps) {
              navigateTo('limit-reached');
            } else {
              navigateTo('game-select');
            }
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <Gamepad2 size={24} />
          <span>بدء عملية جديدة</span>
        </button>

        <button
          onClick={() => navigateTo('admin')}
          className="w-full bg-slate-700 text-slate-300 py-4 px-6 rounded-xl font-medium text-lg hover:bg-slate-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Settings size={24} />
          <span>لوحة التحكم</span>
        </button>

        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">العمليات المنفذة</span>
            <span className="text-emerald-400 font-bold text-xl">
              {operationCount} / {maxOps}
            </span>
          </div>
          <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${(operationCount / maxOps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
