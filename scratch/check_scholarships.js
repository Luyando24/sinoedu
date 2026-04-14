const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing ENV vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data: programs, error: pError } = await supabase
    .from('programs')
    .select('title, scholarship_id, scholarship_details')
    .limit(5);

  const { data: scholarships, error: sError } = await supabase
    .from('scholarships')
    .select('id, name');

  console.log("--- Programs ---");
  console.log(JSON.stringify(programs, null, 2));
  console.log("--- Scholarships ---");
  console.log(JSON.stringify(scholarships, null, 2));
}

checkData();
