-- Setup trending_campaigns table
CREATE TABLE IF NOT EXISTS public.trending_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_month VARCHAR(50) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    description TEXT,
    bullets JSONB DEFAULT '[]'::JSONB,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup trending_campaign_leads table
CREATE TABLE IF NOT EXISTS public.trending_campaign_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.trending_campaigns(id),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deactivate all campaigns before inserting so we only have one active at a time
UPDATE public.trending_campaigns SET is_active = false;

-- Seed data for June (FIFA World Cup 2026)
INSERT INTO public.trending_campaigns (event_month, event_name, headline, description, bullets, image_url, is_active)
VALUES (
    'June 2026',
    'FIFA World Cup 2026',
    'How Brands Are Capitalizing on the World Cup Traffic Surge',
    'The 2026 World Cup is driving massive global engagement. See how top e-commerce brands are pivoting their messaging to ride the wave and how you can apply these tactics to your store.',
    '[
        "Implement real-time action triggers (e.g. flash sales when a team scores)",
        "Leverage geo-targeted ads around host cities",
        "Adopt tournament-style bracket promotions for higher engagement"
    ]'::JSONB,
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop', -- Football image
    true
);

-- Seed data for July (Spider-Man Release)
INSERT INTO public.trending_campaigns (event_month, event_name, headline, description, bullets, image_url, is_active)
VALUES (
    'July 2026',
    'Blockbuster Movie Release',
    'The Spider-Man Strategy: Building Hype Before the Drop',
    'Marvel is a master class in building anticipation. Learn the exact 3-phase pre-launch email sequence you can steal to build hype for your next product drop.',
    '[
        "Phase 1: The Teaser - Plant the seed 30 days out",
        "Phase 2: The Trailer - Reveal the value proposition",
        "Phase 3: The Premiere - High-urgency launch day sequence"
    ]'::JSONB,
    'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop', -- Spider-Man themed image
    false
);
