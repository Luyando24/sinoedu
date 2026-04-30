const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("Program Data:", JSON.stringify(data[0], null, 2));
  } else {
    console.log("No programs found.");
  }
}

checkData();
