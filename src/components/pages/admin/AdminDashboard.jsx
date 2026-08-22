import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LogOut, 
  Type, 
  DollarSign, 
  Briefcase, 
  Image as ImageIcon, 
  MessageSquareQuote, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Menu, 
  X, 
  ExternalLink, 
  ArrowLeft, 
  Sparkles, 
  Shield,
  ShieldCheck,
  Key,
  FolderGit2
} from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import { useAdminAuth } from '../../../context/AdminAuthContext'
import OverviewManager from './OverviewManager'
import HeroManager from './HeroManager'
import PricingManager from './PricingManager'
import ServicesManager from './ServicesManager'
import PortfolioManager from './PortfolioManager'
import ClientProjectsManager from './ClientProjectsManager'
import ReviewsManager from './ReviewsManager'
import LeadsManager from './LeadsManager'
import TeamManager from './TeamManager'
import AdminPermissionsManager from './AdminPermissionsManager'

const ALL_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, permission: null },
  { id: 'leads', label: 'Inquiries & Calls', icon: Users, permission: 'manage_leads' },
  { id: 'team', label: 'Team & Founders', icon: UserCheck, permission: 'manage_team' },
  { id: 'hero', label: 'Hero Copy', icon: Type, permission: 'manage_hero' },
  { id: 'pricing', label: 'Pricing Packages', icon: DollarSign, permission: 'manage_pricing' },
  { id: 'services', label: 'Services', icon: Briefcase, permission: 'manage_services' },
  { id: 'portfolio', label: 'Portfolio', icon: ImageIcon, permission: 'manage_portfolio' },
  { id: 'client_projects', label: 'Client Projects', icon: FolderGit2, permission: 'manage_client_projects' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, permission: 'manage_reviews' },
  { id: 'admins', label: 'Admins & Permissions', icon: Shield, permission: 'manage_admins' },
]

export default function AdminDashboard() {
  const { admin, profile, isSuperAdmin, hasPermission } = useAdminAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Visible tabs based on current user's permissions
  const visibleTabs = ALL_TABS.filter((tab) => {
    if (!tab.permission) return true
    if (isSuperAdmin) return true
    return hasPermission(tab.permission)
  })

  // Ensure active tab is within permitted visible tabs
  useEffect(() => {
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id || 'overview')
    }
  }, [visibleTabs, activeTab])

  // Close mobile menu on tab change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeTab])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin')
  }

  if (!admin) {
    return null
  }

  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : profile?.role === 'editor'
    ? 'Content Editor'
    : profile?.role === 'support'
    ? 'Support & Leads'
    : profile?.role === 'admin'
    ? 'Administrator'
    : 'Custom Staff'

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--text-primary)] hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" title="Back to main website">
            <img
              src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')}
              alt="G-One Media Logo"
              className="h-7 w-auto object-contain hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Website</span>
          </Link>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-[var(--bg-primary)] border-r border-[var(--border-subtle)] z-50 flex flex-col lg:hidden"
            >
              <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white">G-One Admin</h2>
                  <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[170px]">{admin.email}</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[var(--accent-blue)] text-black font-bold shadow-md'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
                >
                  <ArrowLeft size={14} />
                  Return to Website
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-primary)] flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="mb-3">
            <Link to="/" title="Back to main website">
              <img
                src={`${import.meta.env.BASE_URL}G-One.png`.replace(/\/+/g, '/')}
                alt="G-One Media Logo"
                className="h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-85 transition-opacity"
              />
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black tracking-tight text-[var(--text-primary)]">
                  Admin Console
                </h2>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[160px]" title={admin.email}>
                {admin.email}
              </p>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  <ShieldCheck size={10} />
                  {roleLabel}
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Connected" />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] text-white font-bold shadow-lg shadow-cyan-500/20'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-[var(--accent-blue)]'} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} className="text-cyan-400" />
            Return to Website
          </Link>

          <a
            href={`${import.meta.env.BASE_URL}`.replace(/\/+/g, '/')}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            <ExternalLink size={13} />
            Open in New Tab
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto relative min-h-[calc(100vh-60px)] lg:min-h-screen">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-blue)]/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewManager onNavigateTab={setActiveTab} />}
            {activeTab === 'leads' && <LeadsManager />}
            {activeTab === 'team' && <TeamManager />}
            {activeTab === 'hero' && <HeroManager />}
            {activeTab === 'pricing' && <PricingManager />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'portfolio' && <PortfolioManager />}
            {activeTab === 'client_projects' && <ClientProjectsManager />}
            {activeTab === 'testimonials' && <ReviewsManager />}
            {activeTab === 'admins' && <AdminPermissionsManager />}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
