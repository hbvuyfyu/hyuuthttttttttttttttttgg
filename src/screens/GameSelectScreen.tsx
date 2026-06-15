import { useApp } from '../store/AppContext';
import { useEffect, useState } from 'react';

export function GameSelectScreen() {
  const { games, loading, navigateTo, setSelectedGame, refreshGames } = useApp();
  const [gamesLoaded, setGamesLoaded] = useState(false);

  useEffect(() => {
    if (!games.length && !gamesLoaded) {
      refreshGames();
      setGamesLoaded(true);
    }
  }, [games, gamesLoaded, refreshGames]);

  if (loading || !games.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-2xl font-bold text-white mb-2">اختر اللعبة</h1>
          <p className="text-slate-400">اختر اللعبة التي تريد العمل عليها</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => {
                setSelectedGame(game);
                navigateTo('event-select');
              }}
              className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg border border-slate-700 hover:border-emerald-500"
            >
              {game.image_url ? (
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="w-full h-24 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-24 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
              )}
              <h3 className="text-white font-bold text-center truncate">{game.name}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
