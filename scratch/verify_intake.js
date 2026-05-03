const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIntake() {
  const { data, error } = await supabase
    .from('programs')
    .select('id, title, intake, general_info')
    .or('intake.ilike.%test abc%,intake.ilike.%Age:%')
    .limit(10);

  if (error) {
    console.error("Error:", error);
    return;
  }

  if (data.length === 0) {
    console.log("No messy intake data found in the database.");
  } else {
    console.log(`Found ${data.length} messy records:`);
    data.forEach(p => {
      console.log(`ID: ${p.id}`);
      console.log(`Title: ${p.title}`);
      console.log(`Intake: ${p.intake}`);
      console.log(`General Info Intake: ${p.general_info?.Intake || p.general_info?.intake || 'N/A'}`);
      console.log('---');
    });
  }
}

checkIntake();
