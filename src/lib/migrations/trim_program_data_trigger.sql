-- Function to clean string fields: trim and replace multiple spaces with single space
CREATE OR REPLACE FUNCTION clean_string_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- For programs table
    IF TG_TABLE_NAME = 'programs' THEN
        NEW.title := regexp_replace(trim(NEW.title), '\s+', ' ', 'g');
        NEW.program_id_code := regexp_replace(trim(NEW.program_id_code), '\s+', ' ', 'g');
        NEW.location := regexp_replace(trim(NEW.location), '\s+', ' ', 'g');
        NEW.level := regexp_replace(trim(NEW.level), '\s+', ' ', 'g');
        NEW.duration := regexp_replace(trim(NEW.duration), '\s+', ' ', 'g');
        NEW.language := regexp_replace(trim(NEW.language), '\s+', ' ', 'g');
        NEW.intake := regexp_replace(trim(NEW.intake), '\s+', ' ', 'g');
    -- For universities table
    ELSIF TG_TABLE_NAME = 'universities' THEN
        NEW.name := regexp_replace(trim(NEW.name), '\s+', ' ', 'g');
        NEW.location := regexp_replace(trim(NEW.location), '\s+', ' ', 'g');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for programs
DROP TRIGGER IF EXISTS trg_clean_programs ON programs;
CREATE TRIGGER trg_clean_programs
BEFORE INSERT OR UPDATE ON programs
FOR EACH ROW
EXECUTE FUNCTION clean_string_fields();

-- Trigger for universities
DROP TRIGGER IF EXISTS trg_clean_universities ON universities;
CREATE TRIGGER trg_clean_universities
BEFORE INSERT OR UPDATE ON universities
FOR EACH ROW
EXECUTE FUNCTION clean_string_fields();
