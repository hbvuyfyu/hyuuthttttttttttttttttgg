import { useApp } from '../store/AppContext';
import { useEffect, useState } from 'react';

export function EventSelectScreen() {
  const { events, selectedGame, loading, navigateTo, setSelectedEvent, refreshEvents } = useApp();
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    if (selectedGame && !eventsLoaded) {
      refreshEvents(selectedGame.id);
      setEventsLoaded(true);
    }
  }, [selectedGame, eventsLoaded, refreshEvents]);

  const gameEvents = events.filter((e) => e.game_id === selectedGame?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!selectedGame) {
    navigateTo('game-select');
    return null;
  }

  if (!gameEvents.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
        <div className="max-w-2xl mx-auto text-center pt-20">
          <p className="text-slate-400 text-xl mb-4">لا توجد أحداث متاحة لهذه اللعبة</p>
          <button
            onClick={() => navigateTo('game-select')}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            العودة لاختيار لعبة أخرى
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white mb-2">اختر الحدث</h1>
          <p className="text-slate-400">
            اللعبة: <span className="text-emerald-400 font-medium">{selectedGame.name}</span>
          </p>
        </div>

        <div className="space-y-3">
          {gameEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                navigateTo('info-form');
              }}
              className="w-full bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-all duration-300 hover:translate-x-2 text-right border border-slate-700 hover:border-emerald-500 shadow-lg"
            >
              <h3 className="text-white font-bold text-lg">{event.name}</h3>
              {event.description && (
                <p className="text-slate-400 text-sm mt-1">{event.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
