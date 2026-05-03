const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Use service role key if available for cleanup
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

const supabase = createClient(supabaseUrl, serviceKey);

async function cleanOne() {
  const id = '70575167-571b-4cad-b3a3-322f4dd517fe';
  console.log(`Updating ${id}...`);
  const { data, error } = await supabase
    .from('programs')
    .update({ intake: 'September 2026' })
    .eq('id', id)
    .select();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success:", data);
  }
}

cleanOne();
