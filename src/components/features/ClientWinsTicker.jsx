import { Bolt } from 'lucide-react'

const WINS = [
  "E-commerce brand scaled 3x ROAS in 30 days",
  "B2B SaaS achieved 150% more inbound leads",
  "Apparel store hit $100k month with new creative",
  "Local service business cut CPL by 40%",
  "Tech startup closed $10k recurring revenue from our funnel"
];

export default function ClientWinsTicker() {
  return (
    <div
      className="w-full bg-linear-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20 backdrop-blur-md border-b border-white/5 text-white py-2"
      style={{ overflow: 'hidden', position: 'relative', zIndex: 40 }}
    >
      <div className="flex animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused]">
        {/* Double the array to ensure seamless looping */}
        {[...WINS, ...WINS, ...WINS, ...WINS].map((win, idx) => (
          <div key={idx} className="flex items-center gap-3 px-8 text-xs font-bold uppercase tracking-widest text-[#b9cacb]">
            <Bolt size={12} className="text-[#00f0ff]" />
            <span>{win}</span>
            <span className="text-white/20 mx-4">•</span>
          </div>
        ))}
      </div>
    </div>
  )
}
