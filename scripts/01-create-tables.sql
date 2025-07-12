-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  hourly_rate TEXT,
  availability TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 0,
  completed_swaps INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- Create user_skills_offered table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_skills_offered (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Create user_skills_wanted table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_skills_wanted (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Create swap_requests table
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_offered_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  skill_wanted_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'cancelled'
  hourly_rate TEXT,
  rating NUMERIC, -- For feedback on completed swaps
  feedback TEXT, -- For feedback on completed swaps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create active_swaps table (for accepted swap requests)
CREATE TABLE IF NOT EXISTS active_swaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill1_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  skill2_id TEXT REFERENCES skills(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  next_session TIMESTAMPTZ,
  total_sessions INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE SET NULL, -- Optional link to a swap request
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_offered ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills_wanted ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_swaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Public users are viewable by everyone." ON users FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own user." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own user." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own user." ON users FOR DELETE USING (auth.uid() = id);

-- Policies for skills table
CREATE POLICY "Skills are viewable by everyone." ON skills FOR SELECT USING (TRUE);

-- Policies for user_skills_offered table
CREATE POLICY "User skills offered are viewable by everyone." ON user_skills_offered FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own skills offered." ON user_skills_offered FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills offered." ON user_skills_offered FOR DELETE USING (auth.uid() = user_id);

-- Policies for user_skills_wanted table
CREATE POLICY "User skills wanted are viewable by everyone." ON user_skills_wanted FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own skills wanted." ON user_skills_wanted FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills wanted." ON user_skills_wanted FOR DELETE USING (auth.uid() = user_id);

-- Policies for swap_requests table
CREATE POLICY "Swap requests are viewable by participants." ON swap_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create swap requests." ON swap_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Participants can update swap request status." ON swap_requests FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Participants can delete their swap requests." ON swap_requests FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Policies for active_swaps table
CREATE POLICY "Active swaps are viewable by participants." ON active_swaps FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Users can create active swaps (via accepted request)." ON active_swaps FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Participants can update active swap details." ON active_swaps FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "Participants can delete active swaps." ON active_swaps FOR DELETE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies for messages table
CREATE POLICY "Messages are viewable by participants." ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can delete their own messages." ON messages FOR DELETE USING (auth.uid() = sender_id);

-- Function to create a new user entry in the 'users' table upon new signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the handle_new_user function after a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
