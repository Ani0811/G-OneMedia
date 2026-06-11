import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkCaseStudies() {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*');
  
  if (error) {
    console.error('Error fetching case studies:', error);
    return;
  }
  
  console.log(`Found ${data.length} case studies:`);
  data.forEach(c => {
    console.log(`- Slug: ${c.slug}, Title: ${c.title}, Category: ${c.category}`);
  });
}

checkCaseStudies();
