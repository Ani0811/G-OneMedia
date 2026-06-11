import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanDatabase() {
  console.log('Cleaning database of non-website records...');
  
  // 1. Delete from portfolio_projects where type is not 'Websites'
  const { data: delProjects, error: errProjects } = await supabase
    .from('portfolio_projects')
    .delete()
    .neq('type', 'Websites')
    .select();
    
  if (errProjects) {
    console.error('Error deleting portfolio projects:', errProjects);
  } else {
    console.log(`Deleted ${delProjects?.length || 0} non-website projects from portfolio_projects.`);
  }

  // 2. Delete from case_studies where the slug does not correspond to a Website project
  // Valid website slugs are: 'foodiefrenzy-saas', 'abt-developer-portfolio', 'rimberio-real-estate'
  const validWebsiteSlugs = ['foodiefrenzy-saas', 'abt-developer-portfolio', 'rimberio-real-estate'];
  
  const { data: delCaseStudies, error: errCaseStudies } = await supabase
    .from('case_studies')
    .delete()
    .not('slug', 'in', `(${validWebsiteSlugs.join(',')})`)
    .select();
    
  if (errCaseStudies) {
    console.error('Error deleting case studies:', errCaseStudies);
  } else {
    console.log(`Deleted ${delCaseStudies?.length || 0} non-website case studies from case_studies.`);
  }
}

cleanDatabase();
