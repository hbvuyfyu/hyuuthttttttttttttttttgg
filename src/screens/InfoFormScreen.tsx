import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function InfoFormScreen() {
  const { selectedGame, selectedEvent, userIdentifier, settings, navigateTo, incrementOperationCount, operationCount } = useApp();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = 'الاسم مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const maxOps = settings?.max_operations_per_user || 10;

    if (operationCount >= maxOps) {
      navigateTo('limit-reached');
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('operations').insert({
        user_identifier: userIdentifier,
        game_id: selectedGame?.id,
        event_id: selectedEvent?.id,
        user_info: formData,
        status: 'pending',
      });

      if (error) throw error;

      const success = Math.random() > 0.1;

      const { error: updateError } = await supabase
        .from('operations')
        .update({ status: success ? 'success' : 'failed' })
        .eq('user_identifier', userIdentifier)
        .eq('game_id', selectedGame?.id)
        .eq('event_id', selectedEvent?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (updateError) throw updateError;

      if (success) {
        incrementOperationCount();
        navigateTo('success');
      } else {
        navigateTo('failed');
      }
    } catch {
      navigateTo('failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedGame || !selectedEvent) {
    navigateTo('game-select');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white mb-2">أدخل معلوماتك</h1>
          <div className="text-slate-400 text-sm space-y-1">
            <p>اللعبة: <span className="text-emerald-400">{selectedGame.name}</span></p>
            <p>الحدث: <span className="text-emerald-400">{selectedEvent.name}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">الاسم *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full bg-slate-800 text-white rounded-lg px-4 py-3 border ${
                errors.username ? 'border-red-500' : 'border-slate-700'
              } focus:border-emerald-500 focus:outline-none transition-colors`}
              placeholder="أدخل اسمك"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">البريد الإلكتروني *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full bg-slate-800 text-white rounded-lg px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-slate-700'
              } focus:border-emerald-500 focus:outline-none transition-colors`}
              placeholder="example@email.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">رقم الهاتف</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors"
              placeholder="+1234567890"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">ملاحظات</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
              placeholder="أي ملاحظات إضافية..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Send size={24} />
                <span>إرسال</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
