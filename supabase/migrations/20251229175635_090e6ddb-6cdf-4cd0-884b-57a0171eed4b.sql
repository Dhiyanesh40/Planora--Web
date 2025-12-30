-- Add notes and photo_url columns to activities table for optional attachments
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS notes text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS photo_url text DEFAULT NULL;