export interface Settings {
  id: number;
  max_operations_per_user: number;
  payment_address_btc: string;
  payment_address_eth: string;
  payment_address_usdt: string;
  subscription_daily_price: number;
  subscription_weekly_price: number;
  subscription_monthly_price: number;
}

export interface Game {
  id: string;
  name: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Event {
  id: string;
  game_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Operation {
  id: string;
  user_identifier: string;
  game_id: string;
  event_id: string;
  user_info: Record<string, unknown>;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export type AppScreen =
  | 'main'
  | 'game-select'
  | 'event-select'
  | 'info-form'
  | 'success'
  | 'failed'
  | 'limit-reached'
  | 'admin'
  | 'admin-games'
  | 'admin-events'
  | 'admin-settings';
