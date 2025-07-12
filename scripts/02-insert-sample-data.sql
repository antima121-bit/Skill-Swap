-- Insert sample skills
INSERT INTO skills (id, name, category) VALUES
('react', 'React', 'Frontend') ON CONFLICT (id) DO NOTHING,
('nodejs', 'Node.js', 'Backend') ON CONFLICT (id) DO NOTHING,
('typescript', 'TypeScript', 'Programming Languages') ON CONFLICT (id) DO NOTHING,
('python', 'Python', 'Programming Languages') ON CONFLICT (id) DO NOTHING,
('ui-ux-design', 'UI/UX Design', 'Design') ON CONFLICT (id) DO NOTHING,
('figma', 'Figma', 'Design Tools') ON CONFLICT (id) DO NOTHING,
('photoshop', 'Photoshop', 'Design Tools') ON CONFLICT (id) DO NOTHING,
('illustrator', 'Illustrator', 'Design Tools') ON CONFLICT (id) DO NOTHING,
('digital-marketing', 'Digital Marketing', 'Marketing') ON CONFLICT (id) DO NOTHING,
('seo', 'SEO', 'Marketing') ON CONFLICT (id) DO NOTHING,
('content-writing', 'Content Writing', 'Writing') ON CONFLICT (id) DO NOTHING,
('machine-learning', 'Machine Learning', 'Data Science') ON CONFLICT (id) DO NOTHING,
('data-analysis', 'Data Analysis', 'Data Science') ON CONFLICT (id) DO NOTHING,
('video-editing', 'Video Editing', 'Media') ON CONFLICT (id) DO NOTHING,
('after-effects', 'After Effects', 'Media') ON CONFLICT (id) DO NOTHING,
('project-management', 'Project Management', 'Business') ON CONFLICT (id) DO NOTHING,
('agile', 'Agile', 'Business') ON CONFLICT (id) DO NOTHING,
('scrum', 'Scrum', 'Business') ON CONFLICT (id) DO NOTHING,
('mobile-development', 'Mobile Development', 'Development') ON CONFLICT (id) DO NOTHING,
('flutter', 'Flutter', 'Mobile Development') ON CONFLICT (id) DO NOTHING,
('3d-modeling', '3D Modeling', 'Design') ON CONFLICT (id) DO NOTHING,
('blender', 'Blender', 'Design Tools') ON CONFLICT (id) DO NOTHING,
('product-design', 'Product Design', 'Design') ON CONFLICT (id) DO NOTHING,
('user-research', 'User Research', 'Research') ON CONFLICT (id) DO NOTHING,
('web-development', 'Web Development', 'Development') ON CONFLICT (id) DO NOTHING,
('javascript', 'JavaScript', 'Programming Languages') ON CONFLICT (id) DO NOTHING;

-- Insert sample users (these will be created by the handle_new_user trigger upon auth.users insertion)
-- For demonstration purposes, if you manually insert into auth.users, these will be populated.
-- If you are using the mock data, these manual inserts are not strictly necessary for the app to run.
-- Example manual insert (replace with actual UUIDs if needed):
-- INSERT INTO users (id, email, name, location, bio, hourly_rate, availability, rating, completed_swaps, is_public, avatar_url) VALUES
-- ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'arjun.sharma@example.com', 'Arjun Sharma', 'Bangalore, Karnataka', 'Full-stack developer passionate about creating innovative solutions', '₹500', 'Evenings, Weekends', 4.8, 12, TRUE, '/images/person-avatar.png'),
-- ('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'priya.patel@example.com', 'Priya Patel', 'Mumbai, Maharashtra', 'Graphic designer wanting to transition into data science', '₹400', 'Weekdays after 6PM', 4.9, 8, TRUE, '/images/person-avatar.png');

-- Link skills to users (assuming users with these IDs exist or will be created)
-- These inserts should be run AFTER users are created (e.g., via signup or manual insert into auth.users and then users table)

-- Arjun Sharma (ID: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' - example UUID)
INSERT INTO user_skills_offered (user_id, skill_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'react') ON CONFLICT (user_id, skill_id) DO NOTHING,
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'nodejs') ON CONFLICT (user_id, skill_id) DO NOTHING;

INSERT INTO user_skills_wanted (user_id, skill_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ui-ux-design') ON CONFLICT (user_id, skill_id) DO NOTHING,
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'figma') ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Priya Patel (ID: 'b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d' - example UUID)
INSERT INTO user_skills_offered (user_id, skill_id) VALUES
('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'photoshop') ON CONFLICT (user_id, skill_id) DO NOTHING,
('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'illustrator') ON CONFLICT (user_id, skill_id) DO NOTHING;

INSERT INTO user_skills_wanted (user_id, skill_id) VALUES
('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'python') ON CONFLICT (user_id, skill_id) DO NOTHING,
('b1cdef01-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'data-analysis') ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Add more sample data for other mock users if their UUIDs are known
-- For example, if Rajesh Kumar's ID is 'c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f':
-- INSERT INTO user_skills_offered (user_id, skill_id) VALUES
-- ('c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'digital-marketing') ON CONFLICT (user_id, skill_id) DO NOTHING,
-- ('c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'seo') ON CONFLICT (user_id, skill_id) DO NOTHING;
-- INSERT INTO user_skills_wanted (user_id, skill_id) VALUES
-- ('c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'web-development') ON CONFLICT (user_id, skill_id) DO NOTHING,
-- ('c2d3e4f5-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'javascript') ON CONFLICT (user_id, skill_id) DO NOTHING;
