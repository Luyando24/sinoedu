const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log("Starting intake data cleanup...");

  // Specifically target the known corrupted entries
  const targets = [
    { id: '8c625be9-3ce4-4398-88b1-6a01d7427b2d', correct: 'September 2026' },
    { id: '70575167-571b-4cad-b3a3-322f4dd517fe', correct: 'September 2026' }
  ];

  for (const target of targets) {
    const { data, error } = await supabase
      .from('programs')
      .update({ intake: target.correct })
      .eq('id', target.id)
      .select();

    if (error) {
      console.error(`Error updating ${target.id}:`, error);
    } else {
      console.log(`Updated program ${target.id} to '${target.correct}'. New data:`, data);
    }
  }

  // Broad search for any others containing 'test abc' or 'Age:' in the intake field
  const { data: others, error: fetchError } = await supabase
    .from('programs')
    .select('id, intake')
    .or('intake.ilike.%test abc%,intake.ilike.%Age:%');

  if (fetchError) {
    console.error("Error fetching other corrupted records:", fetchError);
  } else if (others && others.length > 0) {
    console.log(`Found ${others.length} additional potentially corrupted records.`);
    for (const record of others) {
      // Simple cleaning: take everything before 'test abc' or 'Age:'
      let clean = record.intake.split(/test abc|Age:/i)[0].trim();
      if (clean && clean !== record.intake) {
        const { data, error: updateError } = await supabase
          .from('programs')
          .update({ intake: clean })
          .eq('id', record.id)
          .select();
        
        if (updateError) {
          console.error(`Error cleaning ${record.id}:`, updateError);
        } else {
          console.log(`Cleaned program ${record.id}: '${record.intake}' -> '${clean}'. New data:`, data);
        }
      }
    }
  }

  console.log("Cleanup complete.");
}

cleanup();
