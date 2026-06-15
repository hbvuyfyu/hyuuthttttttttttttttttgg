import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function SuccessScreen() {
  const { navigateTo, operationCount, settings } = useApp();
  const remaining = (settings?.max_operations_per_user || 10) - operationCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">تم بنجاح!</h1>
        <p className="text-slate-400 mb-2">تم تنفيذ العملية بنجاح</p>
        <p className="text-emerald-400 font-medium mb-8">
          العمليات المتبقية: {remaining}
        </p>

        <button
          onClick={() => navigateTo('main')}
          className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

export function FailedScreen() {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <XCircle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">فشل الإرسال</h1>
        <p className="text-slate-400 mb-8">لم يتم تنفيذ العملية. يرجى المحاولة مرة أخرى</p>

        <div className="space-y-3">
          <button
            onClick={() => navigateTo('info-form')}
            className="w-full bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => navigateTo('main')}
            className="w-full bg-slate-700 text-slate-300 px-8 py-3 rounded-xl font-medium text-lg hover:bg-slate-600 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

export function LimitReachedScreen() {
  const { navigateTo, settings } = useApp();
  const maxOps = settings?.max_operations_per_user || 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <AlertTriangle size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">تم الوصول للحد الأقصى</h1>
        <p className="text-slate-400 mb-2">
          لقد استنفذت عدد العمليات المسموح بها
        </p>
        <p className="text-amber-400 font-medium mb-8">
          الحد الأقصى: {maxOps} عمليات
        </p>

        <button
          onClick={() => navigateTo('main')}
          className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}
