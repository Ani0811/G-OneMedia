import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_PROJECT_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials missing in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('\n🚀 Starting G-One Media Database Seeding & Migration...\n')

  // 1. Seed Hero Content
  console.log('📝 Seeding Hero Content...')
  const { data: existingHero } = await supabase.from('hero_content').select('id').limit(1)
  if (!existingHero || existingHero.length === 0) {
    const { error: heroErr } = await supabase.from('hero_content').insert([
      {
        headline: 'We Help Businesses Grow with High-Converting Websites',
        subheadline: 'G-One Media bridges the gap between Sophisticated Engineering and Compelling Visual Narratives. We design and build elite Digital Ecosystems engineered to capture attention, command authority, and accelerate business growth.',
        cta_text: 'Get Started',
      }
    ])
    if (heroErr) console.warn('  ⚠️ Hero seed note:', heroErr.message)
    else console.log('  ✅ Hero content seeded.')
  } else {
    console.log('  ℹ️ Hero content already exists.')
  }

  // 2. Seed Pricing Packages
  console.log('\n💰 Seeding Pricing Packages...')
  const initialPackages = [
    {
      category: 'Websites & Apps',
      name: 'Starter',
      original_price_inr: '₹10,999',
      original_price_usd: '$139',
      original_price_eur: '€129',
      price_inr: '₹5,999',
      price_usd: '$79',
      price_eur: '€75',
      period: '/ project',
      duration: '3 - 5 days',
      description: 'Perfect for local businesses and personal portfolios',
      features: ['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO', 'Fast 3-5 Days Delivery'],
    },
    {
      category: 'Websites & Apps',
      name: 'Growth',
      original_price_inr: '₹22,999',
      original_price_usd: '$279',
      original_price_eur: '€259',
      price_inr: '₹12,999',
      price_usd: '$169',
      price_eur: '€159',
      period: '/ project',
      duration: '1 - 2 weeks',
      description: 'For scaling companies looking for custom design & CMS',
      features: ['Custom UI/UX Design', 'CMS Integration', 'Advanced Animations', 'Performance Optimization', 'Search Engine Optimization'],
    },
    {
      category: 'Websites & Apps',
      name: 'Premium',
      original_price_inr: '₹42,999',
      original_price_usd: '$529',
      original_price_eur: '€489',
      price_inr: '₹23,999',
      price_usd: '$299',
      price_eur: '€279',
      period: '/ project',
      duration: '3 - 4 weeks',
      description: 'Enterprise level solutions, web apps, and full custom ecosystems',
      features: ['Advanced Integrations', 'Custom Dashboards', 'Workflow Automations', 'AI Features', 'Dedicated Support'],
    }
  ]

  for (const pkg of initialPackages) {
    const { data: exists } = await supabase.from('pricing_packages').select('id').eq('name', pkg.name).limit(1)
    if (!exists || exists.length === 0) {
      const { error } = await supabase.from('pricing_packages').insert([pkg])
      if (error) console.warn(`  ⚠️ Package ${pkg.name} error:`, error.message)
      else console.log(`  ✅ Seeded package: ${pkg.name}`)
    } else {
      console.log(`  ℹ️ Package already exists: ${pkg.name}`)
    }
  }

  // 3. Seed Individual Services
  console.log('\n🛠️ Seeding Individual Services...')
  const initialServices = [
    {
      category: 'Development',
      name: 'Discovery Call 1:1 (Free)',
      original_price_inr: 'Free',
      original_price_usd: 'Free',
      original_price_eur: 'Free',
      price_inr: 'Free',
      price_usd: 'Free',
      price_eur: 'Free',
      duration: '30 mins',
      link: 'https://calendly.com/g-onemedia/discovery-call',
      icon: 'customize.png',
    },
    {
      category: 'Development',
      name: 'Landing Page',
      original_price_inr: '₹16,999 - ₹32,999',
      original_price_usd: '$219 - $419',
      original_price_eur: '€199 - €389',
      price_inr: '₹8,499 - ₹16,999',
      price_usd: '$109 - $219',
      price_eur: '€99 - €199',
      duration: '2 - 4 days',
      icon: 'landing-page.png',
    },
    {
      category: 'Development',
      name: 'Business Website',
      original_price_inr: '₹32,999 - ₹84,999',
      original_price_usd: '$429 - $1,049',
      original_price_eur: '€389 - €959',
      price_inr: '₹16,999 - ₹42,999',
      price_usd: '$219 - $549',
      price_eur: '€199 - €499',
      duration: '5 - 10 days',
      icon: 'software-application.png',
    },
    {
      category: 'Development',
      name: 'Custom Dashboard / Web App',
      original_price_inr: '₹84,999 - ₹2,14,999',
      original_price_usd: '$1,099 - $2,699',
      original_price_eur: '€989 - €2,449',
      price_inr: '₹42,999 - ₹1,09,999',
      price_usd: '$549 - $1,399',
      price_eur: '€499 - €1,269',
      duration: '2 - 4 weeks',
      icon: 'business-intelligence.png',
    },
    {
      category: 'Development',
      name: 'MVP Development',
      original_price_inr: '₹1,09,999 - ₹4,29,999',
      original_price_usd: '$1,299 - $5,399',
      original_price_eur: '€1,189 - €4,899',
      price_inr: '₹54,999 - ₹2,19,999',
      price_usd: '$689 - $2,749',
      price_eur: '€629 - €2,499',
      duration: '3 - 6 weeks',
      icon: 'innovation.png',
    },
    {
      category: 'Development',
      name: 'AI Chatbot Integration',
      original_price_inr: '₹27,999 - ₹81,999',
      original_price_usd: '$329 - $979',
      original_price_eur: '€299 - €889',
      price_inr: '₹13,999 - ₹41,999',
      price_usd: '$169 - $499',
      price_eur: '€149 - €449',
      duration: '4 - 7 days',
      icon: 'chatbot.png',
    },
    {
      category: 'Development',
      name: 'Custom LLM Training',
      original_price_inr: '₹54,999 - ₹1,64,999',
      original_price_usd: '$659 - $1,979',
      original_price_eur: '€599 - €1,799',
      price_inr: '₹27,999 - ₹82,999',
      price_usd: '$339 - $999',
      price_eur: '€299 - €899',
      duration: '1 - 2 weeks',
      icon: 'robot.png',
    },
    {
      category: 'Development',
      name: 'WhatsApp Bot Integration',
      original_price_inr: '₹32,999 - ₹84,999',
      original_price_usd: '$429 - $1,049',
      original_price_eur: '€389 - €959',
      price_inr: '₹16,999 - ₹42,999',
      price_usd: '$219 - $549',
      price_eur: '€199 - €499',
      duration: '4 - 7 days',
      icon: 'whatsapp.png',
    },
    {
      category: 'Development',
      name: 'Maintenance Retainer',
      original_price_inr: '₹11,999 - ₹32,999 / mo',
      original_price_usd: '$159 - $429 / mo',
      original_price_eur: '€139 - €389 / mo',
      price_inr: '₹5,999 - ₹16,999 / mo',
      price_usd: '$79 - $219 / mo',
      price_eur: '€69 - €199 / mo',
      duration: 'Monthly',
      icon: 'mechanic.png',
    }
  ]

  for (const srv of initialServices) {
    const { data: exists } = await supabase.from('services').select('id').eq('name', srv.name).limit(1)
    if (!exists || exists.length === 0) {
      const { error } = await supabase.from('services').insert([srv])
      if (error) console.warn(`  ⚠️ Service ${srv.name} error:`, error.message)
      else console.log(`  ✅ Seeded service: ${srv.name}`)
    } else {
      console.log(`  ℹ️ Service already exists: ${srv.name}`)
    }
  }

  // 4. Seed Verified Reviews
  console.log('\n⭐ Seeding Verified Client Reviews...')
  const initialReviews = [
    {
      name: 'Arjun Mehta',
      role: 'Founder, NovaTech',
      rating: 5,
      review: 'Our conversions jumped 30% in the 2nd month. G-One Media rebuilt our web infrastructure and high-converting funnels flawlessly.',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      is_approved: true,
    },
    {
      name: 'Priya Sharma',
      role: 'CEO, FitFlow',
      rating: 5,
      review: 'Professional, fast, and creative. The website and social media content package was exactly what we needed for our launch.',
      image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      is_approved: true,
    },
    {
      name: 'Rahul Verma',
      role: 'Director, Luxe Interiors',
      rating: 5,
      review: 'The brand video and digital ecosystem they created perfectly captures our aesthetic. Clean work, great communication throughout.',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      is_approved: true,
    }
  ]

  for (const rev of initialReviews) {
    const { data: exists } = await supabase.from('reviews').select('id').eq('name', rev.name).limit(1)
    if (!exists || exists.length === 0) {
      const { error } = await supabase.from('reviews').insert([rev])
      if (error) console.warn(`  ⚠️ Review for ${rev.name} error:`, error.message)
      else console.log(`  ✅ Seeded review: ${rev.name}`)
    } else {
      console.log(`  ℹ️ Review already exists: ${rev.name}`)
    }
  }

  console.log('\n✨ Database migration and seeding completed successfully!\n')
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
