const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncTuition() {
  console.log("Fetching programs with null tuition_fee...");
  
  const { data: programs, error: fetchError } = await supabase
    .from('programs')
    .select('id, title, fee_structure')
    .or('tuition_fee.is.null,tuition_fee.eq.""');

  if (fetchError) {
    console.error("Error fetching programs:", fetchError);
    return;
  }

  console.log(`Found ${programs.length} programs to check.`);

  let updatedCount = 0;

  for (const program of programs) {
    if (program.fee_structure && typeof program.fee_structure === 'object') {
      const keys = Object.keys(program.fee_structure);
      const tuitionKey = keys.find(k => k.toLowerCase().includes('tuition'));
      
      if (tuitionKey) {
        const tuitionValue = program.fee_structure[tuitionKey];
        console.log(`Updating "${program.title}" with tuition: ${tuitionValue}`);
        
        const { error: updateError } = await supabase
          .from('programs')
          .update({ tuition_fee: tuitionValue })
          .eq('id', program.id);

        if (updateError) {
          console.error(`Failed to update ${program.title}:`, updateError);
        } else {
          updatedCount++;
        }
      }
    }
  }

  console.log(`Successfully updated ${updatedCount} programs.`);
}

syncTuition();
