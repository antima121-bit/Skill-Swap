-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  location text,
  hourly_rate numeric,
  rating numeric default 0,
  completed_swaps integer default 0,
  constraint username_length check (char_length(username) >= 3)
);

-- Create skills table
create table if not exists public.skills (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  category text,
  description text
);

-- Create user_skills table (for both offering and learning)
create table if not exists public.user_skills (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles on delete cascade not null,
  skill_id uuid references public.skills on delete cascade not null,
  proficiency_level integer check (proficiency_level between 1 and 5),
  is_offering boolean default false,
  is_learning boolean default false,
  unique(user_id, skill_id)
);

-- Create swap_requests table
create table if not exists public.swap_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  requester_id uuid references public.profiles on delete cascade not null,
  recipient_id uuid references public.profiles on delete cascade not null,
  skill_offered_id uuid references public.skills on delete cascade not null,
  skill_wanted_id uuid references public.skills on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected', 'cancelled')) default 'pending',
  message text,
  hourly_rate numeric
);

-- Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sender_id uuid references public.profiles on delete cascade not null,
  recipient_id uuid references public.profiles on delete cascade not null,
  swap_request_id uuid references public.swap_requests on delete cascade,
  content text not null,
  is_read boolean default false
);

-- Create active_swaps table
create table if not exists public.active_swaps (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  swap_request_id uuid references public.swap_requests on delete cascade not null,
  user1_id uuid references public.profiles on delete cascade not null,
  user2_id uuid references public.profiles on delete cascade not null,
  skill1_id uuid references public.skills on delete cascade not null,
  skill2_id uuid references public.skills on delete cascade not null,
  status text check (status in ('active', 'completed', 'cancelled')) default 'active',
  next_session timestamp with time zone,
  total_sessions integer default 0
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.swap_requests enable row level security;
alter table public.messages enable row level security;
alter table public.active_swaps enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Skills are public
create policy "Skills are viewable by everyone"
  on public.skills for select
  using (true);

-- User skills policies
create policy "User skills are viewable by everyone"
  on public.user_skills for select
  using (true);

create policy "Users can insert their own skills"
  on public.user_skills for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own skills"
  on public.user_skills for update
  using (auth.uid() = user_id);

create policy "Users can delete their own skills"
  on public.user_skills for delete
  using (auth.uid() = user_id);

-- Swap request policies
create policy "Swap requests are viewable by involved users"
  on public.swap_requests for select
  using (auth.uid() in (requester_id, recipient_id));

create policy "Users can create swap requests"
  on public.swap_requests for insert
  with check (auth.uid() = requester_id);

create policy "Users can update their own swap requests"
  on public.swap_requests for update
  using (auth.uid() in (requester_id, recipient_id));

-- Message policies
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() in (sender_id, recipient_id));

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can update their own messages"
  on public.messages for update
  using (auth.uid() = sender_id);

-- Active swaps policies
create policy "Users can view their active swaps"
  on public.active_swaps for select
  using (auth.uid() in (user1_id, user2_id));

create policy "Users can update their active swaps"
  on public.active_swaps for update
  using (auth.uid() in (user1_id, user2_id));

-- Functions and Triggers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 