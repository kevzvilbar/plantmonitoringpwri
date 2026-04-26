-- PWRI Plant Monitoring - Database Schema
-- Run this in Supabase SQL Editor

-- Plants table
CREATE TABLE IF NOT EXISTS plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sensors table
CREATE TABLE IF NOT EXISTS sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
    sensor_id TEXT UNIQUE NOT NULL,
    sensor_type TEXT NOT NULL CHECK (sensor_type IN ('pH', 'temperature', 'turbidity', 'dissolved_oxygen', 'conductivity', 'chlorine')),
    name TEXT,
    unit TEXT NOT NULL,
    min_threshold DECIMAL,
    max_threshold DECIMAL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sensor readings table (time-series data)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id TEXT NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    sensor_type TEXT NOT NULL,
    value DECIMAL NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    sensor_id TEXT REFERENCES sensors(sensor_id) ON DELETE SET NULL,
    plant_id UUID REFERENCES plants(id) ON DELETE SET NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance thresholds table
CREATE TABLE IF NOT EXISTS compliance_thresholds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parameter TEXT NOT NULL,
    min_value DECIMAL,
    max_value DECIMAL,
    unit TEXT NOT NULL,
    regulation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_sensors_plant_id ON sensors(plant_id);

-- Enable Row Level Security
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_thresholds ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to read all data
CREATE POLICY "Allow authenticated read plants" ON plants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read sensors" ON sensors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read sensor_readings" ON sensor_readings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read compliance_thresholds" ON compliance_thresholds FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to update alerts (for acknowledging)
CREATE POLICY "Allow authenticated update alerts" ON alerts FOR UPDATE TO authenticated USING (true);

-- Allow service role full access for API functions
CREATE POLICY "Allow service role all plants" ON plants FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role all sensors" ON sensors FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role all sensor_readings" ON sensor_readings FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role all alerts" ON alerts FOR ALL TO service_role USING (true);
CREATE POLICY "Allow service role all compliance_thresholds" ON compliance_thresholds FOR ALL TO service_role USING (true);
