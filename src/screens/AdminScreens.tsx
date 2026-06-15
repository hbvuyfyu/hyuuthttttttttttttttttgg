import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Gamepad2,
  CalendarDays,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Save,
  Loader2,
} from 'lucide-react';
import type { Settings, Game, Event } from '../types';

function AdminHome() {
  const { navigateTo } = useApp();

  const menuItems = [
    { screen: 'admin-games' as const, icon: Gamepad2, label: 'إدارة الألعاب', color: 'from-emerald-500 to-teal-500' },
    { screen: 'admin-events' as const, icon: CalendarDays, label: 'إدارة الأحداث', color: 'from-blue-500 to-indigo-500' },
    { screen: 'admin-settings' as const, icon: SettingsIcon, label: 'الإعدادات', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white mb-2">لوحة التحكم</h1>
          <p className="text-slate-400">إدارة التطبيق والإعدادات</p>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => navigateTo(item.screen)}
              className={`w-full bg-gradient-to-r ${item.color} p-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3`}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigateTo('main')}
          className="mt-8 w-full bg-slate-700 text-slate-300 py-3 px-6 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
}

function AdminGames() {
  const { navigateTo } = useApp();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState({ name: '', image_url: '' });

  const fetchGames = async () => {
    const { data } = await supabase.from('games').select('*').order('sort_order');
    if (data) setGames(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const saveGame = async (game: Game) => {
    setSaving(true);
    const { error } = await supabase
      .from('games')
      .update({ name: game.name, image_url: game.image_url, is_active: game.is_active })
      .eq('id', game.id);
    if (!error) await fetchGames();
    setSaving(false);
  };

  const addGame = async () => {
    if (!newGame.name.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('games')
      .insert({ name: newGame.name, image_url: newGame.image_url || null });
    if (!error) {
      setNewGame({ name: '', image_url: '' });
      setShowAddForm(false);
      await fetchGames();
    }
    setSaving(false);
  };

  const deleteGame = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه اللعبة؟')) return;
    await supabase.from('games').delete().eq('id', id);
    await fetchGames();
  };

  const updateGameField = (id: string, field: keyof Game, value: unknown) => {
    setGames(games.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white">إدارة الألعاب</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            <div className="space-y-3">
              <input
                type="text"
                value={newGame.name}
                onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
                placeholder="اسم اللعبة"
              />
              <input
                type="text"
                value={newGame.image_url}
                onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
                placeholder="رابط الصورة"
                dir="ltr"
              />
              <div className="flex gap-2">
                <button
                  onClick={addGame}
                  disabled={saving}
                  className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin inline" size={16} /> : 'حفظ'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="flex items-start gap-4">
                {game.image_url ? (
                  <img src={game.image_url} alt={game.name} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-slate-500" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={game.name}
                    onChange={(e) => updateGameField(game.id, 'name', e.target.value)}
                    className="w-full bg-slate-700 text-white rounded px-3 py-1 border border-slate-600"
                  />
                  <input
                    type="text"
                    value={game.image_url || ''}
                    onChange={(e) => updateGameField(game.id, 'image_url', e.target.value)}
                    className="w-full bg-slate-700 text-white rounded px-3 py-1 border border-slate-600 text-sm"
                    placeholder="رابط الصورة"
                    dir="ltr"
                  />
                  <label className="flex items-center gap-2 text-slate-300 text-sm">
                    <input
                      type="checkbox"
                      checked={game.is_active}
                      onChange={(e) => updateGameField(game.id, 'is_active', e.target.checked)}
                      className="rounded"
                    />
                    <span>نشط</span>
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => saveGame(game)}
                    disabled={saving}
                    className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => deleteGame(game.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigateTo('admin')}
          className="mt-8 w-full bg-slate-700 text-slate-300 py-3 px-6 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>رجوع</span>
        </button>
      </div>
    </div>
  );
}

function AdminEvents() {
  const { navigateTo } = useApp();
  const [games, setGames] = useState<Game[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', game_id: '' });

  useEffect(() => {
    const fetchData = async () => {
      const [gamesRes, eventsRes] = await Promise.all([
        supabase.from('games').select('*').order('name'),
        supabase.from('events').select('*').order('sort_order'),
      ]);
      if (gamesRes.data) setGames(gamesRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const saveEvent = async (event: Event) => {
    setSaving(true);
    const { error } = await supabase
      .from('events')
      .update({ name: event.name, description: event.description, is_active: event.is_active })
      .eq('id', event.id);
    if (!error) {
      const eventsRes = await supabase.from('events').select('*').order('sort_order');
      if (eventsRes.data) setEvents(eventsRes.data);
    }
    setSaving(false);
  };

  const addEvent = async () => {
    if (!newEvent.name.trim() || !newEvent.game_id) return;
    setSaving(true);
    const { error } = await supabase.from('events').insert({
      name: newEvent.name,
      description: newEvent.description || null,
      game_id: newEvent.game_id,
    });
    if (!error) {
      setNewEvent({ name: '', description: '', game_id: '' });
      setShowAddForm(false);
      const eventsRes = await supabase.from('events').select('*').order('sort_order');
      if (eventsRes.data) setEvents(eventsRes.data);
    }
    setSaving(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الحدث؟')) return;
    await supabase.from('events').delete().eq('id', id);
    const eventsRes = await supabase.from('events').select('*').order('sort_order');
    if (eventsRes.data) setEvents(eventsRes.data);
  };

  const updateEventField = (id: string, field: keyof Event, value: unknown) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const getGameName = (gameId: string) => games.find((g) => g.id === gameId)?.name || 'غير معروف';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white">إدارة الأحداث</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span>إضافة</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            <div className="space-y-3">
              <select
                value={newEvent.game_id}
                onChange={(e) => setNewEvent({ ...newEvent, game_id: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
              >
                <option value="">اختر اللعبة</option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
                placeholder="اسم الحدث"
              />
              <input
                type="text"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600"
                placeholder="الوصف"
              />
              <div className="flex gap-2">
                <button
                  onClick={addEvent}
                  disabled={saving}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin inline" size={16} /> : 'حفظ'}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <div className="space-y-2">
                <p className="text-slate-400 text-sm">{getGameName(event.game_id)}</p>
                <input
                  type="text"
                  value={event.name}
                  onChange={(e) => updateEventField(event.id, 'name', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded px-3 py-1 border border-slate-600"
                />
                <input
                  type="text"
                  value={event.description || ''}
                  onChange={(e) => updateEventField(event.id, 'description', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded px-3 py-1 border border-slate-600 text-sm"
                  placeholder="الوصف"
                />
                <label className="flex items-center gap-2 text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    checked={event.is_active}
                    onChange={(e) => updateEventField(event.id, 'is_active', e.target.checked)}
                    className="rounded"
                  />
                  <span>نشط</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEvent(event)}
                    disabled={saving}
                    className="flex-1 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    <span>حفظ</span>
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigateTo('admin')}
          className="mt-8 w-full bg-slate-700 text-slate-300 py-3 px-6 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>رجوع</span>
        </button>
      </div>
    </div>
  );
}

function AdminSettings() {
  const { navigateTo } = useApp();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (field: keyof Settings, value: string | number) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    const { error } = await supabase
      .from('settings')
      .update({
        max_operations_per_user: settings.max_operations_per_user,
        payment_address_btc: settings.payment_address_btc,
        payment_address_eth: settings.payment_address_eth,
        payment_address_usdt: settings.payment_address_usdt,
        subscription_daily_price: settings.subscription_daily_price,
        subscription_weekly_price: settings.subscription_weekly_price,
        subscription_monthly_price: settings.subscription_monthly_price,
      })
      .eq('id', 1);
    if (!error) {
      setMessage('تم الحفظ بنجاح');
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage('حدث خطأ');
    }
    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white mb-2">الإعدادات</h1>
          <p className="text-slate-400">تكوين التطبيق</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">حد العمليات</h2>
            <div className="flex items-center gap-4">
              <label className="text-slate-300">الحد الأقصى للعمليات:</label>
              <input
                type="number"
                value={settings.max_operations_per_user}
                onChange={(e) => handleChange('max_operations_per_user', parseInt(e.target.value) || 0)}
                className="w-24 bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 text-center"
              />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">عناوين الدفع</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-sm mb-1">BTC</label>
                <input
                  type="text"
                  value={settings.payment_address_btc}
                  onChange={(e) => handleChange('payment_address_btc', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 font-mono text-sm"
                  dir="ltr"
                  placeholder="btc_address"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">ETH</label>
                <input
                  type="text"
                  value={settings.payment_address_eth}
                  onChange={(e) => handleChange('payment_address_eth', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 font-mono text-sm"
                  dir="ltr"
                  placeholder="eth_address"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">USDT</label>
                <input
                  type="text"
                  value={settings.payment_address_usdt}
                  onChange={(e) => handleChange('payment_address_usdt', e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 font-mono text-sm"
                  dir="ltr"
                  placeholder="usdt_address"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-bold text-white mb-4">أسعار الاشتراكات</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">يومي</label>
                <input
                  type="number"
                  value={settings.subscription_daily_price}
                  onChange={(e) => handleChange('subscription_daily_price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">أسبوعي</label>
                <input
                  type="number"
                  value={settings.subscription_weekly_price}
                  onChange={(e) => handleChange('subscription_weekly_price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">شهري</label>
                <input
                  type="number"
                  value={settings.subscription_monthly_price}
                  onChange={(e) => handleChange('subscription_monthly_price', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 text-center py-2 rounded-lg">
              {message}
            </div>
          )}

          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Save size={24} />
                <span>حفظ الإعدادات</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigateTo('admin')}
            className="w-full bg-slate-700 text-slate-300 py-3 px-6 rounded-xl font-medium hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>رجوع</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export { AdminHome, AdminGames, AdminEvents, AdminSettings };
