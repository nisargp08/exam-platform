-- Add institution field to exam_results table
ALTER TABLE exam_results 
ADD COLUMN IF NOT EXISTS institution TEXT;

-- Update any existing records to have a default institution value
UPDATE exam_results 
SET institution = 'Not Specified' 
WHERE institution IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'exam_results' 
ORDER BY ordinal_position;
