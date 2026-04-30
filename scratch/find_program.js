const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function findProgram() {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('tuition_fee', '15,000 RMB');

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

findProgram();
