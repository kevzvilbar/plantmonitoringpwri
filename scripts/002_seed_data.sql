-- PWRI Plant Monitoring - Seed Data
-- Run this after 001_create_tables.sql

-- Insert sample plants
INSERT INTO plants (id, name, location, status) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Main Treatment Facility', 'Building A - North Campus', 'online'),
    ('22222222-2222-2222-2222-222222222222', 'Secondary Processing', 'Building B - East Wing', 'online'),
    ('33333333-3333-3333-3333-333333333333', 'Filtration Station', 'Building C - West Campus', 'maintenance')
ON CONFLICT DO NOTHING;

-- Insert sample sensors
INSERT INTO sensors (plant_id, sensor_id, sensor_type, name, unit, min_threshold, max_threshold, status) VALUES
    ('11111111-1111-1111-1111-111111111111', 'pH-001', 'pH', 'Primary pH Sensor', 'pH', 6.5, 8.5, 'active'),
    ('11111111-1111-1111-1111-111111111111', 'TEMP-001', 'temperature', 'Inlet Temperature', 'C', 15, 30, 'active'),
    ('11111111-1111-1111-1111-111111111111', 'TURB-001', 'turbidity', 'Outlet Turbidity', 'NTU', 0, 4, 'active'),
    ('11111111-1111-1111-1111-111111111111', 'DO-001', 'dissolved_oxygen', 'Aeration Tank DO', 'mg/L', 2, 8, 'active'),
    ('22222222-2222-2222-2222-222222222222', 'pH-002', 'pH', 'Secondary pH Sensor', 'pH', 6.5, 8.5, 'active'),
    ('22222222-2222-2222-2222-222222222222', 'TEMP-002', 'temperature', 'Process Temperature', 'C', 18, 28, 'active'),
    ('22222222-2222-2222-2222-222222222222', 'CL-001', 'chlorine', 'Chlorine Residual', 'mg/L', 0.2, 4, 'active'),
    ('33333333-3333-3333-3333-333333333333', 'TURB-002', 'turbidity', 'Filter Inlet', 'NTU', 0, 10, 'maintenance')
ON CONFLICT DO NOTHING;

-- Insert compliance thresholds (EPA standards)
INSERT INTO compliance_thresholds (parameter, min_value, max_value, unit, regulation) VALUES
    ('pH', 6.5, 8.5, 'pH', 'EPA Primary Standards'),
    ('turbidity', NULL, 4, 'NTU', 'EPA Primary Standards'),
    ('chlorine_residual', 0.2, 4, 'mg/L', 'EPA Primary Standards'),
    ('temperature', NULL, 30, 'C', 'State Discharge Permit'),
    ('dissolved_oxygen', 2, NULL, 'mg/L', 'State Discharge Permit')
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (type, message, sensor_id, plant_id, acknowledged) VALUES
    ('warning', 'pH level approaching upper threshold (8.3)', 'pH-001', '11111111-1111-1111-1111-111111111111', false),
    ('info', 'Scheduled maintenance completed successfully', NULL, '33333333-3333-3333-3333-333333333333', true),
    ('critical', 'Turbidity sensor offline - requires attention', 'TURB-002', '33333333-3333-3333-3333-333333333333', false),
    ('warning', 'Temperature fluctuation detected (26.5C to 28.2C)', 'TEMP-002', '22222222-2222-2222-2222-222222222222', true),
    ('info', 'Daily compliance report generated', NULL, NULL, true)
ON CONFLICT DO NOTHING;

-- Insert sample sensor readings (last 24 hours simulation)
INSERT INTO sensor_readings (sensor_id, sensor_type, value, unit, timestamp) VALUES
    ('pH-001', 'pH', 7.1, 'pH', NOW() - INTERVAL '24 hours'),
    ('pH-001', 'pH', 7.2, 'pH', NOW() - INTERVAL '20 hours'),
    ('pH-001', 'pH', 7.3, 'pH', NOW() - INTERVAL '16 hours'),
    ('pH-001', 'pH', 7.2, 'pH', NOW() - INTERVAL '12 hours'),
    ('pH-001', 'pH', 7.1, 'pH', NOW() - INTERVAL '8 hours'),
    ('pH-001', 'pH', 7.2, 'pH', NOW() - INTERVAL '4 hours'),
    ('pH-001', 'pH', 7.2, 'pH', NOW()),
    ('TEMP-001', 'temperature', 23.5, 'C', NOW() - INTERVAL '24 hours'),
    ('TEMP-001', 'temperature', 23.2, 'C', NOW() - INTERVAL '20 hours'),
    ('TEMP-001', 'temperature', 24.0, 'C', NOW() - INTERVAL '16 hours'),
    ('TEMP-001', 'temperature', 25.5, 'C', NOW() - INTERVAL '12 hours'),
    ('TEMP-001', 'temperature', 25.0, 'C', NOW() - INTERVAL '8 hours'),
    ('TEMP-001', 'temperature', 24.2, 'C', NOW() - INTERVAL '4 hours'),
    ('TEMP-001', 'temperature', 24.5, 'C', NOW()),
    ('TURB-001', 'turbidity', 0.6, 'NTU', NOW() - INTERVAL '24 hours'),
    ('TURB-001', 'turbidity', 0.7, 'NTU', NOW() - INTERVAL '20 hours'),
    ('TURB-001', 'turbidity', 0.8, 'NTU', NOW() - INTERVAL '16 hours'),
    ('TURB-001', 'turbidity', 0.9, 'NTU', NOW() - INTERVAL '12 hours'),
    ('TURB-001', 'turbidity', 0.7, 'NTU', NOW() - INTERVAL '8 hours'),
    ('TURB-001', 'turbidity', 0.8, 'NTU', NOW() - INTERVAL '4 hours'),
    ('TURB-001', 'turbidity', 0.8, 'NTU', NOW())
ON CONFLICT DO NOTHING;
