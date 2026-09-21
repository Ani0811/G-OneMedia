import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.SUPABASE_CONNECTION_URL });

async function run() {
  try {
    const cols = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pricing_packages'"
    );
    console.log('Columns:', cols.rows.map(r => `${r.column_name} (${r.data_type})`));

    const starterFeatures = JSON.stringify([
      'Up to 5–7 Pages',
      'Modern UI/UX Design',
      'Mobile, Tablet & Desktop Responsive',
      'Basic SEO Setup',
      'Social Media Integration',
      'Speed & Performance Optimization',
      'Domain & Hosting Setup Assistance',
      'SSL / Security Setup',
      'Website Deployment',
      'Ongoing Basic Support & Maintenance'
    ]);

    const advancedFeatures = JSON.stringify([
      'Up to 10–15 Dynamic Pages',
      'Modern UI/UX Design + Advanced Animations',
      'Mobile, Tablet & Desktop Responsive',
      'Advanced Search Engine Optimization (SEO)',
      'Social Media & Channel Integration',
      'Speed & Performance Optimization',
      'Domain & Hosting Setup Assistance',
      'SSL & Security Setup',
      'Website Deployment',
      'Ongoing Priority Support & Maintenance',
      'Dynamic Website Functionality & Database',
      'CMS Integration (Content Management)',
      'WhatsApp / Chatbot Integration',
      'Payment Gateway Integration (if required)',
      'Automated Enquiry & Lead Capture Management',
      'Email Notifications & Workflow Automation',
      'Custom API Automation & Integrations',
      'Analytics & Conversion Tracking'
    ]);

    const res1 = await pool.query(
      'UPDATE pricing_packages SET features = $1 WHERE id = $2 RETURNING id, name',
      [starterFeatures, 1]
    );
    console.log('Update 1:', res1.rows);

    const res2 = await pool.query(
      'UPDATE pricing_packages SET features = $1 WHERE id = $2 RETURNING id, name',
      [advancedFeatures, 2]
    );
    console.log('Update 2:', res2.rows);

    console.log('✅ Pricing parity successfully applied to database!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

run();
