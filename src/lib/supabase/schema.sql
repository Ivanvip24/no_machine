-- No_Machine Database Schema
-- This file contains the SQL schema for the Supabase database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the generations table to store user boundary responses
CREATE TABLE IF NOT EXISTS generations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_input TEXT NOT NULL,
    response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS generations_user_id_idx ON generations(user_id);
CREATE INDEX IF NOT EXISTS generations_created_at_idx ON generations(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own generations
CREATE POLICY "Users can view their own generations"
ON generations FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own generations
CREATE POLICY "Users can insert their own generations"
ON generations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own generations
CREATE POLICY "Users can update their own generations"
ON generations FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own generations
CREATE POLICY "Users can delete their own generations"
ON generations FOR DELETE
USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for the generations table
CREATE TRIGGER update_generations_updated_at
    BEFORE UPDATE ON generations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a function to get user generation count
CREATE OR REPLACE FUNCTION get_user_generation_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM generations WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a function to get recent generations for a user
CREATE OR REPLACE FUNCTION get_recent_generations(user_uuid UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    user_input TEXT,
    response JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT g.id, g.user_input, g.response, g.created_at
    FROM generations g
    WHERE g.user_id = user_uuid
    ORDER BY g.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;