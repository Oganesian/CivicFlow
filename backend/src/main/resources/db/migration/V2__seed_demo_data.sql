-- V2__seed_demo_data.sql
-- CivicFlow Seed Demo Data (Fictional Municipal Operations)

-- Teams
INSERT INTO teams (id, name, description, active, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111101', 'Roads & Infrastructure', 'Handles asphalt repair, potholes, sidewalks, and road surface hazards.', TRUE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111102', 'Street Lighting', 'Repairs street lanterns, traffic lights, and municipal electrical fixtures.', TRUE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111103', 'Parks & Green Spaces', 'Maintains public greenery, playgrounds, fallen branches, and urban trees.', TRUE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111104', 'Waste Management', 'Handles illegal waste dumps, bin overflows, and municipal street cleanliness.', TRUE, NOW(), NOW()),
('11111111-1111-1111-1111-111111111105', 'Water & Drainage', 'Manages storm drain clogs, minor surface flooding, and hydrant maintenance.', TRUE, NOW(), NOW());

-- Users (Password for all demo accounts is DemoPass!2026)
-- BCrypt hash: $2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu
INSERT INTO users (id, email, display_name, password_hash, role, team_id, active, created_at, updated_at) VALUES
('22222222-2222-2222-2222-222222222201', 'dispatcher@demo.civicflow.app', 'Mara Dispatcher', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'DISPATCHER', NULL, TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222202', 'technician@demo.civicflow.app', 'Lukas Keller (Roads)', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'TECHNICIAN', '11111111-1111-1111-1111-111111111101', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222203', 'lighting.tech@demo.civicflow.app', 'Elena Weber (Lighting)', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'TECHNICIAN', '11111111-1111-1111-1111-111111111102', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222204', 'parks.tech@demo.civicflow.app', 'Jonas Becker (Parks)', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'TECHNICIAN', '11111111-1111-1111-1111-111111111103', TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222205', 'admin@demo.civicflow.app', 'Dr. Clara Sommer', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'ADMIN', NULL, TRUE, NOW(), NOW()),
('22222222-2222-2222-2222-222222222206', 'resident@demo.civicflow.app', 'Alex Meyer', '$2a$10$P5KZ8Q6ZcCv3el4qdI47FO7GgnC3peoXdOQDLYLc7JWmlo6/mPTFu', 'RESIDENT', NULL, TRUE, NOW(), NOW());

-- Categories
INSERT INTO categories (id, name, slug, description, default_sla_hours, active, created_at, updated_at) VALUES
('33333333-3333-3333-3333-333333333301', 'Potholes & Road Damage', 'potholes-road-damage', 'Deep potholes, broken pavement, asphalt cracks causing traffic hazard.', 48, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333302', 'Street Lighting', 'street-lighting', 'Dark street lamps, flickering lanterns, broken light fixtures.', 24, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333303', 'Illegal Waste Dumping', 'illegal-waste-dumping', 'Bulky waste, chemical refuse, unauthorized trash piles in public space.', 36, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333304', 'Parks & Playgrounds', 'parks-playgrounds', 'Damaged playground equipment, fallen branches, broken benches.', 72, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333305', 'Traffic Signs & Signals', 'traffic-signs-signals', 'Missing stop signs, bent posts, non-functional pedestrian signals.', 12, TRUE, NOW(), NOW()),
('33333333-3333-3333-3333-333333333306', 'Drainage & Flooding', 'drainage-flooding', 'Blocked street storm drains, pooled rainwater, surface overflow.', 24, TRUE, NOW(), NOW());

-- Issues
-- 1. NEW issue awaiting triage
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444401', 'CF-2026-00101', 'Deep pothole on Schillerstraße near bakery', 'A large pothole roughly 40cm wide has formed right in the bicycle lane, causing near accidents.', '33333333-3333-3333-3333-333333333301', 'NEW', 'HIGH', 'resident.schiller@example.test', 'Schillerstraße 42', 52.520008, 13.404954, 'Mitte', NULL, NULL, NOW() + INTERVAL '48 hours', NULL, 0, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- 2. TRIAGED issue
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444402', 'CF-2026-00102', 'Flickering street lantern on Goethebrücke', 'Lamp post #14 flickers constantly at night and goes dark intermittently.', '33333333-3333-3333-3333-333333333302', 'TRIAGED', 'MEDIUM', 'goethe.commuter@example.test', 'Goethebrücke North Pillar', 52.531200, 13.385400, 'Nordstadt', NULL, NULL, NOW() + INTERVAL '20 hours', NULL, 0, NOW() - INTERVAL '6 hours', NOW() - INTERVAL '4 hours');

-- 3. ASSIGNED issue
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444403', 'CF-2026-00103', 'Broken swing chain in Stadtpark playground', 'The left seat chain on the toddler swing set has detached from the anchor hook.', '33333333-3333-3333-3333-333333333304', 'ASSIGNED', 'HIGH', 'park.parent@example.test', 'Stadtpark East Play Area', 52.508900, 13.364200, 'Westend', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222204', NOW() + INTERVAL '36 hours', NULL, 0, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '3 hours');

-- 4. IN_PROGRESS issue (assigned to Lukas Keller)
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444404', 'CF-2026-00104', 'Sinkhole forming around manhole cover on Ringstraße', 'Asphalt subsidence observed around the sewer manhole. Risk of sudden collapse.', '33333333-3333-3333-3333-333333333301', 'IN_PROGRESS', 'CRITICAL', 'security.patrol@example.test', 'Ringstraße 108', 52.495000, 13.432000, 'Ostend', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', NOW() + INTERVAL '8 hours', NULL, 0, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour');

-- 5. RESOLVED issue
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444405', 'CF-2026-00105', 'Illegal tire dump in forest path parking lot', 'Around 15 old car tires were dumped next to the recycling container bay.', '33333333-3333-3333-3333-333333333303', 'RESOLVED', 'MEDIUM', 'green.watcher@example.test', 'Forstweg Parking Bay 3', 52.482000, 13.398000, 'Südviertel', '11111111-1111-1111-1111-111111111104', NULL, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '2 hours', 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 hours');

-- 6. CLOSED issue
INSERT INTO issues (id, reference_code, title, description, category_id, status, priority, reporter_email, location_name, latitude, longitude, district, assigned_team_id, assigned_user_id, due_at, resolved_at, version, created_at, updated_at) VALUES
('44444444-4444-4444-4444-444444444406', 'CF-2026-00106', 'Bent stop sign at intersection Marktstraße / Bergstraße', 'Stop sign post was hit by delivery van and leans at 45 degrees, obscuring sight.', '33333333-3333-3333-3333-333333333305', 'CLOSED', 'HIGH', 'local.resident@example.test', 'Marktstraße / Bergstraße', 52.515000, 13.412000, 'Mitte', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', 0, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day');

-- Comments
INSERT INTO issue_comments (id, issue_id, author_id, body, visibility, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 'Priority escalated to CRITICAL due to potential underground void.', 'INTERNAL', NOW() - INTERVAL '20 hours', NOW() - INTERVAL '20 hours'),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222202', 'Emergency road barrier placed. Hydro-excavation crew scheduled for 14:00.', 'INTERNAL', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 'Municipal crew is on site securing the area. Traffic has been rerouted around the lane.', 'PUBLIC', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222201', 'Tires have been collected by municipal special waste team and sent for recycling.', 'PUBLIC', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- Events / Audit Trail
INSERT INTO issue_events (id, issue_id, actor_id, event_type, previous_value, new_value, metadata_json, created_at) VALUES
('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', NULL, 'CREATED', NULL, 'NEW', '{"source":"PUBLIC_PORTAL"}', NOW() - INTERVAL '2 hours'),
('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444404', NULL, 'CREATED', NULL, 'NEW', '{"source":"PUBLIC_PORTAL"}', NOW() - INTERVAL '1 day'),
('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 'STATUS_CHANGED', 'NEW', 'TRIAGED', '{"reason":"Safety inspection required"}', NOW() - INTERVAL '22 hours'),
('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 'PRIORITY_CHANGED', 'HIGH', 'CRITICAL', '{"reason":"Sinkhole risk"}', NOW() - INTERVAL '20 hours'),
('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222201', 'ASSIGNED', NULL, 'Roads & Infrastructure / Lukas Keller', '{"teamId":"11111111-1111-1111-1111-111111111101","userId":"22222222-2222-2222-2222-222222222202"}', NOW() - INTERVAL '18 hours'),
('66666666-6666-6666-6666-666666666606', '44444444-4444-4444-4444-444444444404', '22222222-2222-2222-2222-222222222202', 'STATUS_CHANGED', 'ASSIGNED', 'IN_PROGRESS', '{"message":"Field inspection begun"}', NOW() - INTERVAL '4 hours'),
('66666666-6666-6666-6666-666666666607', '44444444-4444-4444-4444-444444444405', '22222222-2222-2222-2222-222222222201', 'STATUS_CHANGED', 'IN_PROGRESS', 'RESOLVED', '{"message":"Tires removed and area cleared"}', NOW() - INTERVAL '2 hours');
