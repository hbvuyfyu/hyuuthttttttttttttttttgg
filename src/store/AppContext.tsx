import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Settings, Game, Event, AppScreen } from '../types';

interface AppState {
  screen: AppScreen;
  screenHistory: AppScreen[];
  settings: Settings | null;
  games: Game[];
  events: Event[];
  selectedGame: Game | null;
  selectedEvent: Event | null;
  userIdentifier: string;
  operationCount: number;
  loading: boolean;
  menuOpen: boolean;
}

interface AppContextType extends AppState {
  navigateTo: (screen: AppScreen) => void;
  goBack: () => void;
  setSelectedGame: (game: Game | null) => void;
  setSelectedEvent: (event: Event | null) => void;
  setUserIdentifier: (id: string) => void;
  incrementOperationCount: () => void;
  setMenuOpen: (open: boolean) => void;
  refreshSettings: () => Promise<void>;
  refreshGames: () => Promise<void>;
  refreshEvents: (gameId?: string) => Promise<void>;
  checkOperationCount: () => Promise<void>;
}

const defaultSettings: Settings = {
  id: 1,
  max_operations_per_user: 10,
  payment_address_btc: '',
  payment_address_eth: '',
  payment_address_usdt: '',
  subscription_daily_price: 0,
  subscription_weekly_price: 0,
  subscription_monthly_price: 0,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    screen: 'main',
    screenHistory: [],
    settings: null,
    games: [],
    events: [],
    selectedGame: null,
    selectedEvent: null,
    userIdentifier: '',
    operationCount: 0,
    loading: true,
    menuOpen: false,
  });

  const navigateTo = useCallback((screen: AppScreen) => {
    setState(prev => ({
      ...prev,
      screen,
      screenHistory: [...prev.screenHistory, prev.screen],
      menuOpen: false,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      const history = [...prev.screenHistory];
      const previousScreen = history.pop() || 'main';
      return {
        ...prev,
        screen: previousScreen,
        screenHistory: history,
      };
    });
  }, []);

  const setSelectedGame = useCallback((game: Game | null) => {
    setState(prev => ({ ...prev, selectedGame: game }));
  }, []);

  const setSelectedEvent = useCallback((event: Event | null) => {
    setState(prev => ({ ...prev, selectedEvent: event }));
  }, []);

  const setUserIdentifier = useCallback((id: string) => {
    setState(prev => ({ ...prev, userIdentifier: id }));
  }, []);

  const incrementOperationCount = useCallback(() => {
    setState(prev => ({ ...prev, operationCount: prev.operationCount + 1 }));
  }, []);

  const setMenuOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, menuOpen: open }));
  }, []);

  const refreshSettings = useCallback(async () => {
    const { data, error } = await supabase.from('settings').select('*').single();
    if (!error && data) {
      setState(prev => ({ ...prev, settings: data }));
    }
  }, []);

  const refreshGames = useCallback(async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (!error && data) {
      setState(prev => ({ ...prev, games: data }));
    }
  }, []);

  const refreshEvents = useCallback(async (gameId?: string) => {
    let query = supabase.from('events').select('*').eq('is_active', true).order('sort_order');
    if (gameId) {
      query = query.eq('game_id', gameId);
    }
    const { data, error } = await query;
    if (!error && data) {
      setState(prev => ({ ...prev, events: data }));
    }
  }, []);

  const checkOperationCount = useCallback(async () => {
    const userId = state.userIdentifier || localStorage.getItem('userIdentifier') || crypto.randomUUID();
    localStorage.setItem('userIdentifier', userId);
    setState(prev => ({ ...prev, userIdentifier: userId }));

    const { data } = await supabase
      .from('operations')
      .select('id')
      .eq('user_identifier', userId)
      .eq('status', 'success');

    setState(prev => ({ ...prev, operationCount: data?.length || 0 }));
  }, [state.userIdentifier]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([refreshSettings(), refreshGames()]);
      await checkOperationCount();
      setState(prev => ({ ...prev, loading: false }));
    };
    init();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigateTo,
        goBack,
        setSelectedGame,
        setSelectedEvent,
        setUserIdentifier,
        incrementOperationCount,
        setMenuOpen,
        refreshSettings,
        refreshGames,
        refreshEvents,
        checkOperationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export { defaultSettings };
