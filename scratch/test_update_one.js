const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const id = '5e7de3b7-6a94-44ac-ab2f-9b7c6d23c348';
  console.log(`Testing update for ID: ${id}`);
  
  const { data, error } = await supabase
    .from('programs')
    .update({ tuition_fee: '26000 CNY/year' })
    .eq('id', id)
    .select();

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Update success:", JSON.stringify(data, null, 2));
  }
}

testUpdate();
