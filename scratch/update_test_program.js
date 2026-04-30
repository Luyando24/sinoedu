const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateProgram() {
  const { data, error } = await supabase
    .from('programs')
    .update({ 
      accommodation_details: "12,000 RMB/Year",
      registration_fee: "600 RMB"
    })
    .eq('id', '85e2ca45-c2d9-4cb4-a923-af4909fdb98f');

  if (error) {
    console.error("Error updating data:", error);
    return;
  }

  console.log("Successfully updated program with test data.");
}

updateProgram();
