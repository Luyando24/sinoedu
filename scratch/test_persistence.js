const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const testId = '85e2ca45-c2d9-4cb4-a923-af4909fdb98f'; // The Chinese Language Program
  const testFee = { "Test Fee": "100 RMB", "Admin Fee": "200 RMB" };

  console.log("Updating program...");
  const { error: updateError } = await supabase
    .from('programs')
    .update({ fee_structure: testFee })
    .eq('id', testId);

  if (updateError) {
    console.error("Update Error:", updateError);
    return;
  }

  console.log("Fetching program back...");
  const { data, error: fetchError } = await supabase
    .from('programs')
    .select('fee_structure')
    .eq('id', testId)
    .single();

  if (fetchError) {
    console.error("Fetch Error:", fetchError);
    return;
  }

  console.log("Fee Structure in DB:", data.fee_structure);
  
  if (JSON.stringify(data.fee_structure) === JSON.stringify(testFee)) {
    console.log("SUCCESS: Fee structure persisted correctly!");
  } else {
    console.log("FAILURE: Fee structure did not match!");
  }
}

testUpdate();
