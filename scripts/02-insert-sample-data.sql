-- Insert sample skills
INSERT INTO skills (name, category) VALUES
('React', 'Frontend Development'),
('Node.js', 'Backend Development'),
('TypeScript', 'Programming Languages'),
('Python', 'Programming Languages'),
('UI/UX Design', 'Design'),
('Figma', 'Design Tools'),
('Photoshop', 'Design Tools'),
('Illustrator', 'Design Tools'),
('Digital Marketing', 'Marketing'),
('SEO', 'Marketing'),
('Content Writing', 'Writing'),
('Machine Learning', 'Data Science'),
('Data Analysis', 'Data Science'),
('Video Editing', 'Media'),
('After Effects', 'Media'),
('Project Management', 'Business'),
('Agile', 'Business'),
('Scrum', 'Business'),
('Mobile Development', 'Development'),
('Flutter', 'Mobile Development'),
('3D Modeling', 'Design'),
('Blender', 'Design Tools'),
('Product Design', 'Design'),
('User Research', 'Research')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, name, location, bio, hourly_rate, availability, rating, completed_swaps) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'arjun.sharma@example.com', 'Arjun Sharma', 'Bangalore, Karnataka', 'Full-stack developer passionate about creating innovative solutions', '₹500', 'Evenings, Weekends', 4.8, 12),
('550e8400-e29b-41d4-a716-446655440002', 'priya.patel@example.com', 'Priya Patel', 'Mumbai, Maharashtra', 'Graphic designer wanting to transition into data science', '₹400', 'Weekdays after 6PM', 4.9, 8),
('550e8400-e29b-41d4-a716-446655440003', 'rajesh.kumar@example.com', 'Rajesh Kumar', 'Delhi, NCR', 'Marketing professional looking to learn coding', '₹350', 'Flexible schedule', 4.7, 15),
('550e8400-e29b-41d4-a716-446655440004', 'sneha.reddy@example.com', 'Sneha Reddy', 'Hyderabad, Telangana', 'Data scientist interested in mobile app development', '₹600', 'Weekends', 4.6, 6),
('550e8400-e29b-41d4-a716-446655440005', 'vikram.singh@example.com', 'Vikram Singh', 'Pune, Maharashtra', 'Video editor looking to expand into 3D animation', '₹450', 'Evenings', 4.8, 10),
('550e8400-e29b-41d4-a716-446655440006', 'kavya.nair@example.com', 'Kavya Nair', 'Chennai, Tamil Nadu', 'Project manager transitioning to product management', '₹550', 'Flexible', 4.9, 14)
ON CONFLICT (email) DO NOTHING;
