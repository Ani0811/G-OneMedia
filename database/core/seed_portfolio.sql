-- ============================================================
-- G-One Media — Seed: Portfolio Projects
-- Inserts all portfolio cards (mirrors the old hardcoded array)
-- ============================================================

-- Clear existing data to prevent duplicates if run multiple times
truncate table portfolio_projects cascade;

insert into portfolio_projects (title, type, category, description, image, link, case_study_slug, sort_order)
values
    'FoodieFrenzy SaaS',
    'Websites',
    'Food SaaS • Full Stack',
    'High-performance food delivery platform and SaaS dashboard with real-time tracking.',
    '/Agency_Websites/FoodieFrenzy.jpg',
    'https://foodie-frenzy-frontend-hpkf.onrender.com',
    'foodiefrenzy-saas',
    10
  ),
  (
    'Aether Insight Bot',
    'AI Agents',
    'AI • Automation',
    'Custom LLM-powered support agent that handles 90% of routine customer inquiries.',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    null,
    'aether-insight-bot',
    20
  ),
  (
    'FitFlow Cinematic',
    'Reels',
    'IG Reels • Fitness',
    'High-energy short-form content for Instagram Reels, driving 1M+ views and engagement.',
    '/Agency_Videos/AiReel.jpg',
    'https://drive.google.com/file/d/1DqnEGWk_w7-eVIBXfgyUv63yPtyZXM63/view',
    'fitflow-cinematic',
    30
  ),
  (
    'G-One Tech Review',
    'YT Videos',
    'YouTube • Tech',
    'In-depth YouTube video production with custom graphics and cinematic B-roll.',
    '/Agency_Videos/Reel.jpg',
    'https://drive.google.com/file/d/1aA4v-bCBV4IG4oqzgb4KiMZ7XgqyEtd-/view',
    'gone-tech-review',
    40
  ),
  (
    'Digital Nomad Life',
    'Vlogs',
    'Vlog • Travel',
    'Long-format cinematic vlog series documenting a global journey of digital entrepreneurship.',
    '/Agency_Videos/0621_Reel.jpg',
    'https://drive.google.com/file/d/1fNKd-6i0fEGVnkEev-TCN9b1P3VU7UZB/view',
    'digital-nomad-life',
    50
  ),
  (
    'ABT Developer Portfolio',
    'Websites',
    'Portfolio • Full Stack',
    'Premium developer portfolio featuring advanced system architectures and creative layouts.',
    '/Agency_Websites/ABT_Portfolio.jpg',
    'https://anirudha-basu-thakur-portfolio.vercel.app',
    'abt-developer-portfolio',
    60
  ),
  (
    'Nexus Data Agent',
    'AI Agents',
    'AI • Analytics',
    'Autonomous data analysis agent for real-time market sentiment tracking.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    null,
    'nexus-data-agent',
    70
  ),
  (
    'Client Showcase',
    'Reels',
    'IG Reels • Client',
    'Dynamic client showcase reel highlighting key achievements and project milestones.',
    '/Agency_Videos/ClientReel.jpg',
    'https://drive.google.com/file/d/1LvITp9vG8ieDu7EGzzmxjdasWbQRFSjN/view',
    'client-showcase',
    80
  ),
  (
    'Aesthetic Cloth Reel',
    'Reels',
    'IG Reels • Fashion',
    'Cinematic fashion showcase featuring high-end apparel with rapid-cut editing.',
    '/Agency_Videos/ClothReel.jpg',
    'https://drive.google.com/file/d/1lFvPCKIzgt3gSTj1T35R2qxgjkjXAKlk/view',
    'aesthetic-cloth-reel',
    90
  ),
  (
    'Aether Essence',
    'YT Videos',
    'YouTube • Cinematic',
    'High-production value cinematic experience showcasing the essence of digital agency work.',
    '/Agency_Videos/Reel1.jpg',
    'https://drive.google.com/file/d/1rmSSFv5UU8UipYjdZtOk0IXvYUwJiwdB/view',
    'aether-essence',
    100
  ),
  (
    'Production Highlights',
    'YT Videos',
    'YouTube • Production',
    'Detailed breakdown of our production process and equipment setup for large-scale projects.',
    '/Agency_Videos/Reel2.jpg',
    'https://drive.google.com/file/d/1vsfhyLj6X0i3s2cHkhQ-S7gszuqDZONB/view',
    'production-highlights',
    110
  ),
  (
    'Behind the Scenes',
    'Vlogs',
    'Vlog • BTS',
    'Raw and authentic look at our team in action during a major brand campaign shoot.',
    '/Agency_Videos/0621_Reel.jpg',
    'https://drive.google.com/file/d/1fNKd-6i0fEGVnkEev-TCN9b1P3VU7UZB/view',
    'behind-the-scenes',
    120
  ),
  (
    'Agency Lifestyle',
    'Vlogs',
    'Vlog • Culture',
    'Insight into the day-to-day culture and creative atmosphere at Aether Agency.',
    '/Agency_Videos/Reel3.jpg',
    'https://drive.google.com/file/d/1CcIoHrBpPCU9ekpeT1CexDY6ULIBbKU9/view',
    'agency-lifestyle',
    130
  ),
  (
    'Dynamic Reel',
    'Reels',
    'IG Reels • Movement',
    'Fast-paced, high-transition reel demonstrating our creative editing capabilities.',
    '/Agency_Videos/Reel.jpg',
    'https://drive.google.com/file/d/1aA4v-bCBV4IG4oqzgb4KiMZ7XgqyEtd-/view',
    'dynamic-reel',
    140
  ),
  (
    'Rimberio Real Estate',
    'Websites',
    'Real Estate • Full Stack',
    'A modern real estate platform to buy, sell, and rent properties featuring interactive maps, dynamic chat, and secure payments.',
    '/Agency_Websites/Rimberio.jpeg',
    'https://realestate-frontend-react.vercel.app/',
    'rimberio-real-estate',
    150
  ),
  (
    'Cinematic Showcase',
    'Reels',
    'IG Reels • Showcase',
    'A cinematic short-form highlight reel showcasing advanced video editing and post-production techniques.',
    '/Portfolio_Videos/Portfolio_Video.jpeg',
    'https://drive.google.com/file/d/1_IgSdGUY0II3z8k82hjgPOfPhVaG4EGB/view',
    'cinematic-showcase',
    25
  )
on conflict do nothing;
