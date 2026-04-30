const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('id, title, tuition_fee, accommodation_details, fee_structure')
    .limit(10);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

listPrograms();
