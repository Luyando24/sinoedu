-- Add general_info and fee_structure columns to programs table
ALTER TABLE programs ADD COLUMN IF NOT EXISTS general_info JSONB DEFAULT '{}'::JSONB;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS fee_structure JSONB DEFAULT '{}'::JSONB;

-- Note: We are keeping the old columns for now to prevent breaking changes, 
-- but data should ideally be migrated. This migration only adds the storage.
