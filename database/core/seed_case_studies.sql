-- ============================================================
-- G-One Media — Seed: Case Studies
-- Inserts detailed case study data for all 15 portfolio projects
-- ============================================================

-- Clear existing data to prevent duplicates if run multiple times
truncate table case_studies cascade;

insert into case_studies (slug, title, category, hero_image, description, challenge, solution, tech_stack, metrics)
values
  (
    'foodiefrenzy-saas',
    'FoodieFrenzy SaaS',
    'Food SaaS • Full Stack',
    '/Agency_Websites/FoodieFrenzy.jpg',
    'A high-performance food delivery platform and SaaS dashboard with real-time tracking, order management, and restaurant analytics.',
    'The client needed a unified platform combining customer-facing ordering with a powerful back-office for restaurant owners — all in one seamless experience.',
    'We built a full-stack React application with real-time WebSocket order tracking, a Razorpay-integrated payment flow, and an admin dashboard with live analytics.',
    array['React', 'Node.js', 'Express', 'PostgreSQL', 'WebSockets', 'Razorpay', 'Tailwind CSS'],
    '[
      {"label": "Revenue Increase", "value": "240%"},
      {"label": "Monthly Users", "value": "12K+"},
      {"label": "Load Time", "value": "0.8s"},
      {"label": "Delivery Time", "value": "2 weeks"}
    ]'::jsonb
  ),
  (
    'abt-developer-portfolio',
    'ABT Developer Portfolio',
    'Portfolio • Full Stack',
    '/Agency_Websites/ABT_Portfolio.jpg',
    'A premium developer portfolio featuring advanced system architectures, creative layouts, and interactive project showcases.',
    'The developer wanted a portfolio that stood out from typical templates — something that felt like a product itself rather than just a resume page.',
    'We designed a dark-mode-first experience with GPU-accelerated animations, interactive project cards with live demos, and a custom CMS for easy content updates.',
    array['React', 'Framer Motion', 'Three.js', 'Vite', 'Vercel'],
    '[
      {"label": "Interview Rate", "value": "+180%"},
      {"label": "Monthly Visitors", "value": "5K+"},
      {"label": "Lighthouse Score", "value": "98/100"},
      {"label": "Build Time", "value": "10 days"}
    ]'::jsonb
  ),
  (
    'aether-insight-bot',
    'Aether Insight Bot',
    'AI • Automation',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
    'A custom LLM-powered support agent that handles 90% of routine customer inquiries, reducing support costs while maintaining high satisfaction.',
    'The client''s support team was overwhelmed with repetitive queries. They needed an intelligent system that could handle common questions while escalating complex ones.',
    'We trained a custom Gemini-based agent on their knowledge base, integrated it across web and WhatsApp channels, and built a handoff system for edge cases.',
    array['Gemini API', 'Node.js', 'React', 'Supabase'],
    '[
      {"label": "Cost Reduction", "value": "65%"},
      {"label": "Queries Resolved", "value": "90%"},
      {"label": "Avg Response", "value": "1.2s"},
      {"label": "Setup Time", "value": "5 days"}
    ]'::jsonb
  ),
  (
    'nexus-data-agent',
    'Nexus Data Agent',
    'AI • Analytics',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    'An autonomous data analysis agent for real-time market sentiment tracking, providing actionable insights from social media and news feeds.',
    'Manual market analysis was too slow for the fast-moving crypto and stock markets. The client needed real-time sentiment signals.',
    'We built a multi-source data pipeline feeding into a Gemini-powered analysis engine, with a React dashboard for real-time visualization.',
    array['Python', 'Gemini API', 'React', 'D3.js', 'Redis', 'WebSockets'],
    '[
      {"label": "Signal Accuracy", "value": "87%"},
      {"label": "Data Sources", "value": "50+"},
      {"label": "Processing", "value": "Real-time"},
      {"label": "Build Time", "value": "3 weeks"}
    ]'::jsonb
  ),
  (
    'fitflow-cinematic',
    'FitFlow Cinematic',
    'IG Reels • Fitness',
    '/Agency_Videos/AiReel.jpg',
    'A high-impact, fast-tempo cinematic reel designed for fitness content creators to boost visual engagement and reach.',
    'The client struggled to keep viewers engaged past the first 3 seconds of their workout videos, resulting in low retention.',
    'We structured a 15-second high-energy edit with sync-beats, dynamic color grading, and key-frame scaling to maintain high user attention.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    '[
      {"label": "Reel Views", "value": "1.2M+"},
      {"label": "Engagement Rate", "value": "+45%"},
      {"label": "Audience Retention", "value": "78%"}
    ]'::jsonb
  ),
  (
    'gone-tech-review',
    'G-One Tech Review',
    'YouTube • Tech',
    '/Agency_Videos/Reel.jpg',
    'Cinematic tech review production showcasing modern hardware with custom animation overlays and motion graphics.',
    'Simplifying technical hardware explanations while maintaining high visual appeal for standard YouTube viewers.',
    'Introduced custom 3D call-outs, micro-animated specs charts, and structured pacing using cinematic macro shots.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Blender'],
    '[
      {"label": "Click-Through Rate", "value": "8.5%"},
      {"label": "Watch Time", "value": "+55%"},
      {"label": "Subscriber Growth", "value": "+12K"}
    ]'::jsonb
  ),
  (
    'digital-nomad-life',
    'Digital Nomad Life',
    'Vlog • Travel',
    '/Agency_Videos/0621_Reel.jpg',
    'A story-driven lifestyle vlog series documenting travel, remote work setup, and entrepreneurial adventures.',
    'Connecting fragmented footage from multiple international locations into a cohesive, engaging narrative.',
    'We developed a color grading template and sound design framework to unify different camera systems and ambient environments.',
    array['Premiere Pro', 'DaVinci Resolve', 'Audition'],
    '[
      {"label": "Retention Rate", "value": "65%"},
      {"label": "Total Views", "value": "500K+"},
      {"label": "Audience Shares", "value": "+30%"}
    ]'::jsonb
  ),
  (
    'client-showcase',
    'Client Showcase',
    'IG Reels • Client',
    '/Agency_Videos/ClientReel.jpg',
    'Dynamic client showcase reel highlighting key achievements and project milestones.',
    'Condensing dense client results and business statistics into a highly digestible and engaging 30-second social format.',
    'Used kinetic typography, bold contrast styling, and smooth transitions to highlight statistical milestones.',
    array['Premiere Pro', 'After Effects', 'Illustrator'],
    '[
      {"label": "Conversion Rate", "value": "+22%"},
      {"label": "Impressions", "value": "250K+"},
      {"label": "Saves & Shares", "value": "1.5K+"}
    ]'::jsonb
  ),
  (
    'aesthetic-cloth-reel',
    'Aesthetic Cloth Reel',
    'IG Reels • Fashion',
    '/Agency_Videos/ClothReel.jpg',
    'A moody, highly stylistic fashion showcase highlighting fabric texture, motion, and brand aesthetics.',
    'Conveying premium fabric quality and apparel fit through standard smartphone screen viewing limitations.',
    'Utilized specialized close-up macro shots, smooth speed-ramping, and color grading targeted at rich clothing tones.',
    array['Premiere Pro', 'DaVinci Resolve', 'After Effects'],
    '[
      {"label": "Sales Referral", "value": "+18%"},
      {"label": "Engagement", "value": "12.4%"},
      {"label": "Video Replays", "value": "4.2x"}
    ]'::jsonb
  ),
  (
    'aether-essence',
    'Aether Essence',
    'YouTube • Cinematic',
    '/Agency_Videos/Reel1.jpg',
    'A stylized visual representation of digital agency workflows, mixing team interaction with product design shots.',
    'Capturing abstract digital processes (coding, design, strategy) in an exciting and visually compelling video format.',
    'Combined physical dynamic camera work with screen-replacement motion graphics and a custom synthesizer soundtrack.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Ableton'],
    '[
      {"label": "Brand Recall", "value": "+40%"},
      {"label": "Inbound Leads", "value": "+15%"},
      {"label": "Video Likes", "value": "8K+"}
    ]'::jsonb
  ),
  (
    'production-highlights',
    'Production Highlights',
    'YouTube • Production',
    '/Agency_Videos/Reel2.jpg',
    'A behind-the-camera deep dive detailing specialized equipment configurations and shooting techniques used for clients.',
    'Explaining professional cinematography terms without alienating non-technical clients who are looking for production services.',
    'Used split-screen comparisons (raw footage vs. final graded edit) to clearly demonstrate visual production value.',
    array['Premiere Pro', 'DaVinci Resolve', 'Lightroom'],
    '[
      {"label": "Lead Quality", "value": "+35%"},
      {"label": "Average View Duration", "value": "6:45"},
      {"label": "Inquiries", "value": "200+"}
    ]'::jsonb
  ),
  (
    'behind-the-scenes',
    'Behind the Scenes',
    'Vlog • BTS',
    '/Agency_Videos/0621_Reel.jpg',
    'An authentic look into high-pressure shoot days, documenting crew cooperation, problem solving, and setup details.',
    'Capturing high-quality BTS footage in fast-paced production environments without disrupting the main camera crew.',
    'Assigned a dedicated lightweight stabilizer rig operator to capture candid moments and real-time adjustments.',
    array['Premiere Pro', 'DaVinci Resolve', 'Lightroom'],
    '[
      {"label": "Team Sentiment", "value": "Positive"},
      {"label": "Social Reach", "value": "+150K"},
      {"label": "Follower Growth", "value": "+5.2%"}
    ]'::jsonb
  ),
  (
    'agency-lifestyle',
    'Agency Lifestyle',
    'Vlog • Culture',
    '/Agency_Videos/Reel3.jpg',
    'A vlog showcasing daily routines, creative brainstorm sessions, and the workspace environment of G-One Media.',
    'Building trust and showcasing company culture in a way that feels organic and non-corporate.',
    'Focused the storytelling on individual designer/developer journeys, using casual dialogue and handheld style cinematography.',
    array['Premiere Pro', 'DaVinci Resolve', 'Audition'],
    '[
      {"label": "Job Applications", "value": "+300%"},
      {"label": "Social Share Rate", "value": "15%"},
      {"label": "Reach", "value": "80K+"}
    ]'::jsonb
  ),
  (
    'dynamic-reel',
    'Dynamic Reel',
    'IG Reels • Movement',
    '/Agency_Videos/Reel.jpg',
    'A fast-cut compilation demonstrating visual editing tricks, transitions, and pacing mechanics.',
    'Standing out in dense social feeds where attention spans are limited to less than 2 seconds.',
    'Used rapid whip-pans, screen shakes, sound effect design, and bold typography within the first 1.5 seconds.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Audition'],
    '[
      {"label": "Views", "value": "2.1M+"},
      {"label": "Saves", "value": "45K"},
      {"label": "Audience Shares", "value": "82K"}
    ]'::jsonb
  ),
  (
    'rimberio-real-estate',
    'Rimberio Real Estate',
    'Real Estate • Full Stack',
    '/Agency_Websites/Rimberio.jpeg',
    'A premium property listing web application featuring interactive Mapbox maps, live support chatbot, and Razorpay checkout.',
    'Real estate platforms often suffer from slow loading times due to high-resolution image assets and heavy mapping libraries.',
    'Implemented smart lazy loading, image optimization pipelines, and dynamic loading of maps and scripts only when needed.',
    array['React', 'Firebase', 'Supabase', 'Razorpay', 'Leaflet', 'Node.js', 'Vite'],
    '[
      {"label": "Page Load Speed", "value": "1.2s"},
      {"label": "Inquiry Conversion", "value": "+28%"},
      {"label": "Active Listings", "value": "500+"},
      {"label": "Bounce Rate", "value": "-15%"}
    ]'::jsonb
  ),
  (
    'cinematic-showcase',
    'Cinematic Showcase',
    'IG Reels • Showcase',
    '/Agency_Videos/AiReel.jpg',
    'A high-impact cinematic showcase highlighting premium editing techniques, color grading, and dynamic sound design.',
    'Capturing the viewer''s interest within the first seconds and retaining engagement through fast pacing and creative transitions.',
    'We developed a high-tempo sequence utilizing speed ramping, match cuts, custom typography overlays, and immersive sound effects.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    '[
      {"label": "Views", "value": "1.5M+"},
      {"label": "Engagement", "value": "+60%"},
      {"label": "Audience Retention", "value": "82%"}
    ]'::jsonb
  ),
  (
    'cinematic-showcase-2',
    'Cinematic Showcase II',
    'IG Reels • Showcase',
    '/Portfolio_Videos/Portfolio2.jpeg',
    'A high-impact cinematic showcase highlighting premium editing techniques, color grading, and dynamic sound design.',
    'Capturing the viewer''s interest within the first seconds and retaining engagement through fast pacing and creative transitions.',
    'We developed a high-tempo sequence utilizing speed ramping, match cuts, custom typography overlays, and immersive sound effects.',
    array['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    '[
      {"label": "Views", "value": "2.0M+"},
      {"label": "Engagement", "value": "+75%"},
      {"label": "Audience Retention", "value": "85%"}
    ]'::jsonb
  )
on conflict (slug) do update
  set title      = excluded.title,
      category   = excluded.category,
      hero_image = excluded.hero_image,
      description= excluded.description,
      challenge  = excluded.challenge,
      solution   = excluded.solution,
      tech_stack = excluded.tech_stack,
      metrics    = excluded.metrics;
