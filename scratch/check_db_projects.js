import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkProjects() {
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }
  
  console.log(`Found ${data.length} projects:`);
  data.forEach(p => {
    console.log(`- ID: ${p.id}, Title: ${p.title}, Type: ${p.type}, Category: ${p.category}, Active: ${p.is_active}`);
  });
}

checkProjects();
