-- Employer Events Management Migration
-- Run this migration to set up the employer_events table and related infrastructure

BEGIN;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS employer_events CASCADE;

-- Create employer_events table
CREATE TABLE IF NOT EXISTS employer_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  virtual_link VARCHAR(512),
  event_type VARCHAR(50) DEFAULT 'recruiting' CHECK (event_type IN ('recruiting', 'webinar', 'networking', 'workshop', 'conference')),
  banner_image_url VARCHAR(512),
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES employer_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employer_events_employer_id ON employer_events(employer_id);
CREATE INDEX IF NOT EXISTS idx_employer_events_event_date ON employer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_employer_events_status ON employer_events(status);
CREATE INDEX IF NOT EXISTS idx_employer_events_created_at ON employer_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_employer_events_is_featured ON employer_events(is_featured DESC);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employer_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_employer_events_updated_at ON employer_events;
CREATE TRIGGER trigger_update_employer_events_updated_at
  BEFORE UPDATE ON employer_events
  FOR EACH ROW
  EXECUTE FUNCTION update_employer_events_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE employer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employer_events
-- Allow anyone to view public upcoming events
CREATE POLICY "Anyone can view public events" ON employer_events
  FOR SELECT USING (status IN ('upcoming', 'ongoing', 'completed'));

-- Allow employers to view their own events in any status
CREATE POLICY "Employers can view their own events" ON employer_events
  FOR SELECT USING (employer_id = auth.uid());

-- Allow only the employer to create events
CREATE POLICY "Employers can create events" ON employer_events
  FOR INSERT WITH CHECK (employer_id = auth.uid());

-- Allow only the employer to update their events
CREATE POLICY "Employers can update their own events" ON employer_events
  FOR UPDATE USING (employer_id = auth.uid());

-- Allow only the employer to delete their events
CREATE POLICY "Employers can delete their own events" ON employer_events
  FOR DELETE USING (employer_id = auth.uid());

-- RLS Policies for event_attendees
-- Allow users to see who attended events
CREATE POLICY "Anyone can view event attendees" ON event_attendees
  FOR SELECT USING (true);

-- Allow users to register for events
CREATE POLICY "Users can register for events" ON event_attendees
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Allow users to cancel their registration
CREATE POLICY "Users can unregister from events" ON event_attendees
  FOR DELETE USING (user_id = auth.uid());

-- Allow event organizers to update attendance status
CREATE POLICY "Event organizers can update attendance" ON event_attendees
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM employer_events 
      WHERE id = event_attendees.event_id 
      AND employer_id = auth.uid()
    )
  );

COMMIT;
