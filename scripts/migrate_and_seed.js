import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const { Client } = pg
const connectionString = process.env.SUPABASE_CONNECTION_URL

if (!connectionString) {
  console.error('❌ Error: SUPABASE_CONNECTION_URL is missing in .env')
  process.exit(1)
}

async function runMigration() {
  console.log('\n🚀 Connecting directly to Supabase PostgreSQL...')
  const client = new Client({ connectionString })

  try {
    await client.connect()
    console.log('✅ Connected to database.')

    // 1. Run database/schema.sql
    console.log('\n📄 Applying database/schema.sql...')
    const schemaSql = fs.readFileSync(path.resolve('./database/schema.sql'), 'utf-8')
    await client.query(schemaSql)
    
    // Alter existing tables if they already exist to ensure new fields are added
    await client.query(`
      ALTER TABLE hero_content ADD COLUMN IF NOT EXISTS tagline TEXT;
      ALTER TABLE hero_content ADD COLUMN IF NOT EXISTS image_url TEXT;
      ALTER TABLE hero_content ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '[]'::jsonb;
    `)
    // Apply public insert reviews policy in case table already exists but policy does not
    await client.query(`
      DO $$ BEGIN
        CREATE POLICY "Public Insert reviews" ON reviews FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `)
    console.log('✅ Schema tables and RLS policies created successfully.')

    // 2. Seed Pricing Packages if empty
    console.log('\n💰 Checking and seeding pricing_packages...')
    const { rows: existingPackages } = await client.query('SELECT id FROM pricing_packages LIMIT 1;')
    if (existingPackages.length === 0) {
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
          features: JSON.stringify(['Up to 5 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO', 'Fast 3-5 Days Delivery']),
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
          features: JSON.stringify(['Custom UI/UX Design', 'CMS Integration', 'Advanced Animations', 'Performance Optimization', 'Search Engine Optimization']),
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
          features: JSON.stringify(['Advanced Integrations', 'Custom Dashboards', 'Workflow Automations', 'AI Features', 'Dedicated Support']),
        }
      ]

      for (const p of initialPackages) {
        await client.query(
          `INSERT INTO pricing_packages (category, name, original_price_inr, original_price_usd, original_price_eur, price_inr, price_usd, price_eur, period, duration, description, features)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb);`,
          [p.category, p.name, p.original_price_inr, p.original_price_usd, p.original_price_eur, p.price_inr, p.price_usd, p.price_eur, p.period, p.duration, p.description, p.features]
        )
      }
      console.log('✅ Seeded 3 default pricing packages.')
    } else {
      console.log('ℹ️ pricing_packages table already has records.')
    }

    // 3. Seed Individual Services if empty
    console.log('\n🛠️ Checking and seeding services...')
    const { rows: existingServices } = await client.query('SELECT id FROM services LIMIT 1;')
    if (existingServices.length === 0) {
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

      for (const s of initialServices) {
        await client.query(
          `INSERT INTO services (category, name, original_price_inr, original_price_usd, original_price_eur, price_inr, price_usd, price_eur, duration, link, icon)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
          [s.category, s.name, s.original_price_inr, s.original_price_usd, s.original_price_eur, s.price_inr, s.price_usd, s.price_eur, s.duration, s.link, s.icon]
        )
      }
      console.log('✅ Seeded 9 default services.')
    } else {
      console.log('ℹ️ services table already has records.')
    }

    // 4. Seed Team Members & Founders if empty
    console.log('\n👥 Checking and seeding team_members...')
    const { rows: existingTeam } = await client.query('SELECT id FROM team_members LIMIT 1;')
    if (existingTeam.length === 0) {
      const initialTeam = [
        {
          slug: 'anirudha',
          name: 'Anirudha Basu Thakur',
          role: 'Co-Founder & Lead Engineer',
          tagline: 'Co-Founder at G-One Media | Full-Stack Developer & Digital Systems Architect',
          description: 'Experienced full-stack developer focused on building high-performance, scalable, and visually refined digital experiences. At G-One Media, I specialize in transforming ideas into powerful web solutions — from SaaS platforms and conversion-focused landing pages to custom business tools and modern web applications.\n\nWith hands-on experience across multiple client and creative projects, I combine clean architecture, performance optimization, and pixel-perfect design to create products that are both functional and impactful. My approach goes beyond development — I focus on building digital ecosystems that help brands scale, operate efficiently, and deliver measurable results.\n\nPassionate about modern web technologies, problem-solving, and turning ambitious visions into reality through clean, scalable code.',
          image: 'Anirudha.jpeg',
          bg_image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
          accent_color: 'cyan',
          email: 'anirudha.basuthakur@gmail.com',
          skills: JSON.stringify([
            { label: 'Full-Stack Development', desc: 'Building high-performance, secure frontends and backends with modern frameworks and architectures.' },
            { label: 'Web Design & Development', desc: 'Crafting clean, responsive, and pixel-perfect websites optimized for speed and engagement.' },
            { label: 'SaaS Platform Development', desc: 'Architecting scalable web applications, databases, API integrations, and billing engines.' },
            { label: 'UI/UX Optimization', desc: 'Implementing smooth animations, micro-interactions, and accessibility to deliver premium user experiences.' }
          ]),
          socials: JSON.stringify([
            { name: 'GitHub', url: 'https://github.com/Ani0811' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/in/anirudha-basu-thakur-686aa8253' },
            { name: 'Instagram', url: 'https://www.instagram.com/this_is_ringo_here/' }
          ]),
          stats: JSON.stringify([
            { value: '20+', label: 'Projects Shipped' },
            { value: '3+', label: 'Years Building' },
            { value: '90+', label: 'Avg Lighthouse Score' }
          ]),
          sort_order: 1,
          is_active: true
        },
        {
          slug: 'vasudev',
          name: 'Vasudev Sharma',
          role: 'Founder & Agency Owner',
          tagline: 'Agency Owner | Content & Brand Strategist',
          description: 'I’m an agency owner passionate about building impactful digital experiences. Over the past year, I contributed to multiple projects across branding, marketing, and digital strategy.\n\nThrough this journey, I’ve collaborated with founders, creators, and businesses to turn ideas into engaging digital platforms. My focus is on combining creativity with strategy to help brands grow with strong online positioning.\n\nCurrently, I’m focused on scaling my agency, building long-term collaborations, and creating platforms that connect with audiences in a real way.',
          image: 'Vasudev.jpeg',
          bg_image: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2071&auto=format&fit=crop',
          accent_color: 'fuchsia',
          email: 'vasudevsharma997@gmail.com',
          skills: JSON.stringify([
            { label: 'Digital Strategy', desc: 'Building platform-optimized strategies and planning.' },
            { label: 'Brand Building', desc: 'Crafting cohesive digital identities and positioning to help brands stand out.' },
            { label: 'Marketing Strategy', desc: 'Driving organic reach and engagement through strategic planning.' },
            { label: 'Project Management', desc: 'Ensuring seamless delivery of web projects from concept to launch.' }
          ]),
          socials: JSON.stringify([
            { name: 'YouTube', url: 'https://www.youtube.com/@vasudevsharma1' },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/vasudev-sharma-a8b4ab22a' },
            { name: 'Instagram', url: 'https://www.instagram.com/vasudev.sharma5/' }
          ]),
          stats: JSON.stringify([
            { value: '50+', label: 'Projects Managed' },
            { value: '4+', label: 'Years Experience' },
            { value: '1M+', label: 'Reach Generated' }
          ]),
          sort_order: 2,
          is_active: true
        }
      ]

      for (const m of initialTeam) {
        await client.query(
          `INSERT INTO team_members (slug, name, role, tagline, description, image, bg_image, accent_color, email, skills, socials, stats, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13, $14);`,
          [m.slug, m.name, m.role, m.tagline, m.description, m.image, m.bg_image, m.accent_color, m.email, m.skills, m.socials, m.stats, m.sort_order, m.is_active]
        )
      }
      console.log('✅ Seeded 2 founders into team_members.')
    } else {
      console.log('ℹ️ team_members table already has records.')
    }

    // 5. Seed Admin Users if empty
    console.log('\n🛡️ Checking and seeding admin_users...')
    const { rows: existingAdmins } = await client.query('SELECT id FROM admin_users LIMIT 1;')
    if (existingAdmins.length === 0) {
      await client.query(
        `INSERT INTO admin_users (email, name, role, permissions, is_active)
         VALUES ($1, $2, $3, $4::jsonb, $5);`,
        [
          'anirudha.basuthakur@gmail.com',
          'Anirudha Basu Thakur',
          'super_admin',
          JSON.stringify(['*']),
          true
        ]
      )
      console.log('✅ Seeded primary Super Admin account into admin_users.')
    } else {
      console.log('ℹ️ admin_users table already has records.')
    }

    // 6. Seed Client Projects if empty
    console.log('\n💼 Checking and seeding client_projects...')
    const { rows: existingClientProjects } = await client.query('SELECT id FROM client_projects LIMIT 1;')
    if (existingClientProjects.length === 0) {
      const initialClientProjects = [
        {
          title: 'FitFlow Gym SaaS',
          client_name: 'FitFlow Athletics',
          category: 'SaaS Platform',
          description: 'A modern fitness scheduling, member management, and automated recurring billing web platform.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
          live_url: 'https://example.com/fitflow',
          technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Stripe']),
          sort_order: 1,
          is_active: true
        },
        {
          title: 'NovaSphere Web3 Protocol',
          client_name: 'Nova Labs Ltd',
          category: 'Web3 & Fintech',
          description: 'Decentralized liquidity aggregator interface featuring sub-second analytics and wallet connectivity.',
          image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
          live_url: 'https://example.com/novasphere',
          technologies: JSON.stringify(['Next.js', 'TailwindCSS', 'Ethers.js', 'TheGraph']),
          sort_order: 2,
          is_active: true
        },
        {
          title: 'Artisan Coffee Roasters',
          client_name: 'Artisan Co.',
          category: 'E-Commerce Storefront',
          description: 'Direct-to-consumer artisanal coffee subscription portal with custom roast builder and high-converting checkout.',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
          live_url: 'https://example.com/artisancoffee',
          technologies: JSON.stringify(['Shopify Hydrogen', 'GraphQL', 'TailwindCSS']),
          sort_order: 3,
          is_active: true
        }
      ]

      for (const cp of initialClientProjects) {
        await client.query(
          `INSERT INTO client_projects (title, client_name, category, description, image, live_url, technologies, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9);`,
          [cp.title, cp.client_name, cp.category, cp.description, cp.image, cp.live_url, cp.technologies, cp.sort_order, cp.is_active]
        )
      }
      console.log('✅ Seeded sample live client projects into client_projects table.')
    } else {
      console.log('ℹ️ client_projects table already has records.')
    }

    console.log('\n🎉 ALL MIGRATIONS AND SEEDING COMPLETED SUCCESSFULLY!\n')
  } catch (err) {
    console.error('❌ Migration Error:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigration()
