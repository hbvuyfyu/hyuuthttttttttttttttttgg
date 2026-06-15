-- Settings table for app configuration
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  max_operations_per_user INTEGER DEFAULT 10,
  payment_address_btc TEXT DEFAULT '',
  payment_address_eth TEXT DEFAULT '',
  payment_address_usdt TEXT DEFAULT '',
  subscription_daily_price DECIMAL DEFAULT 0,
  subscription_weekly_price DECIMAL DEFAULT 0,
  subscription_monthly_price DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO settings (id) VALUES (1);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Operations table
CREATE TABLE operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier TEXT NOT NULL,
  game_id UUID REFERENCES games(id),
  event_id UUID REFERENCES events(id),
  user_info JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations ENABLE ROW LEVEL SECURITY;

-- Settings policies (public read, authenticated write)
CREATE POLICY "settings_select" ON settings FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "settings_update" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Games policies
CREATE POLICY "games_select" ON games FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "games_insert" ON games FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "games_update" ON games FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "games_delete" ON games FOR DELETE TO authenticated USING (true);

-- Events policies
CREATE POLICY "events_select" ON events FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "events_insert" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "events_update" ON events FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "events_delete" ON events FOR DELETE TO authenticated USING (true);

-- Operations policies
CREATE POLICY "operations_select" ON operations FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "operations_insert" ON operations FOR INSERT TO PUBLIC WITH CHECK (true);

-- Function to count operations per user
CREATE OR REPLACE FUNCTION get_user_operation_count(p_user_identifier TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM operations WHERE user_identifier = p_user_identifier);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;