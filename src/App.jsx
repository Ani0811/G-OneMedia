import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { trackPageView } from './utils/analytics'
import Navbar from './components/common/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Portfolio from './components/features/Portfolio'
import Process from './components/sections/Process'
import Pricing from './components/sections/Pricing'
import Testimonials from './components/sections/Testimonials'
import CTA from './components/sections/CTA'
import RefundSection from './components/sections/RefundSection'
import Footer from './components/common/Footer'
import NotFound from './components/pages/NotFound'
import BudgetCalculator from './components/sections/BudgetCalculator'
import AIChatWidget from './components/features/AIChatWidget'
import ScheduleModal from './components/features/ScheduleModal'
import Loader from './components/common/Loader'
import ClientWinsTicker from './components/features/ClientWinsTicker'
import VisualProof from './components/sections/VisualProof'
import CookieBanner from './components/common/CookieBanner'
import ScrollToTop from './components/common/ScrollToTop'

// Lazy loaded page components
const GetStarted = lazy(() => import('./components/pages/GetStarted'))
const ServiceDetail = lazy(() => import('./components/pages/ServiceDetail'))
const CaseStudyDetail = lazy(() => import('./components/pages/CaseStudyDetail'))
const ClientLogin = lazy(() => import('./components/features/ClientLogin'))
const ClientDashboard = lazy(() => import('./components/features/ClientDashboard'))
const RefundRequest = lazy(() => import('./components/pages/RefundRequest'))
const Reviews = lazy(() => import('./components/pages/Reviews'))
const DiscoveryCall = lazy(() => import('./components/pages/DiscoveryCall'))
const FounderProfile = lazy(() => import('./components/pages/FounderProfile'))
const ResourceVault = lazy(() => import('./components/pages/ResourceVault'))
const AuditWizard = lazy(() => import('./components/pages/AuditWizard'))
const PageLoader = () => (
  <div className="min-h-screen bg-[#050508] flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
  </div>
)

function HomePage({ onScheduleCall }) {
  return (
    <>
      <Helmet>
        <title>G-One Media | High-Performance Digital Agency</title>
        <meta name="description" content="G-One Media — A digital agency crafting high-converting websites and engaging video content that drives business growth." />
        <meta name="keywords" content="G-One Media, digital marketing agency, web design agency, app development, AI agents, video production, video editing, social media growth, SEO optimization, high-converting websites" />
        <link rel="canonical" href="https://ani0811.github.io/G-OneMedia/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ani0811.github.io/G-OneMedia/" />
        <meta property="og:title" content="G-One Media | High-Performance Digital Agency" />
        <meta property="og:description" content="G-One Media — A digital agency crafting high-converting websites and engaging video content that drives business growth." />
        <meta property="og:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ani0811.github.io/G-OneMedia/" />
        <meta property="twitter:title" content="G-One Media | High-Performance Digital Agency" />
        <meta property="twitter:description" content="G-One Media — A digital agency crafting high-converting websites and engaging video content that drives business growth." />
        <meta property="twitter:image" content="https://ani0811.github.io/G-OneMedia/G-One.png" />
      </Helmet>
      <Hero onScheduleCall={onScheduleCall} />
      <ClientWinsTicker />
      <VisualProof />
      <Services />
      <Portfolio />
      <Process />
      <BudgetCalculator />
      <Pricing onScheduleCall={onScheduleCall} />
      <Testimonials />
      <About />
      <RefundSection />
      <CTA />
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const location = useLocation()
  const handleComplete = useCallback(() => setLoading(false), [])

  useEffect(() => {
    // Wake up backend server to handle cold start delays
    const API_BASE = import.meta.env.DEV
      ? 'http://localhost:3001'
      : (import.meta.env.VITE_API_BACKEND_URL || '')
    if (API_BASE) {
      console.log('[API Warmup] Pinged backend base URL to warm it up:', API_BASE);
      fetch(API_BASE.replace(/\/$/, '')).catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      trackPageView(location.pathname + location.search + location.hash)
    }
  }, [location, loading])

  useEffect(() => {
    if (!loading && location.pathname === '/' && location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        const timer = setTimeout(() => {
          const offset = 85
          const bodyRect = document.body.getBoundingClientRect().top
          const elementRect = el.getBoundingClientRect().top
          const elementPosition = elementRect - bodyRect
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          })
          // Clear the hash from the URL bar so it doesn't linger on refresh
          window.history.replaceState(null, null, window.location.pathname + window.location.search)
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [location, loading])

  const handleScheduleCall = useCallback(() => {
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSdxQXLe2dz7zdL9v2HUiG1ZaK4WoEPpWvP4Ujm_HeMOIJ85Yg/viewform?usp=sharing&ouid=108472766452800645520', '_blank', 'noopener,noreferrer')
  }, [])

  if (loading) {
    return (
      <HelmetProvider>
        <ThemeProvider>
          <Loader onComplete={handleComplete} />
        </ThemeProvider>
      </HelmetProvider>
    )
  }

  return (
    <HelmetProvider>
      <ThemeProvider>
        <div className="min-h-screen relative">
          <ScrollToTop />
          <Navbar onScheduleCall={handleScheduleCall} />
          <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage onScheduleCall={handleScheduleCall} />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/services/:slug" element={<ServiceDetail onScheduleCall={handleScheduleCall} />} />
              <Route path="/portfolio/:id" element={<CaseStudyDetail />} />
              <Route path="/about/:slug" element={<FounderProfile />} />
              <Route path="/portal" element={<ClientLogin />} />
              <Route path="/portal/dashboard" element={<ClientDashboard />} />
              <Route path="/refund" element={<RefundRequest />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/discovery" element={<DiscoveryCall />} />
              <Route path="/vault" element={<ResourceVault />} />
              <Route path="/audit" element={<AuditWizard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />

          {/* Global AI Chat Widget */}
          <AIChatWidget />
          
          <CookieBanner />
        </div>
      </ThemeProvider>
    </HelmetProvider>
  )
}
