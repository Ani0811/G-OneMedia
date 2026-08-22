import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { trackPageView } from './utils/analytics'
import Navbar from './components/common/Navbar'
import Hero from './components/sections/Hero'
import Footer from './components/common/Footer'
import NotFound from './components/pages/NotFound'
import AIChatWidget from './components/features/AIChatWidget'
import ScheduleModal from './components/features/ScheduleModal'
import Loader from './components/common/Loader'
import CookieBanner from './components/common/CookieBanner'
import ScrollToTop from './components/common/ScrollToTop'
import ProtectedRoute from './components/common/ProtectedRoute'
import LazySection from './components/common/LazySection'

// Helper to retry dynamic imports when they fail (e.g. ChunkLoadError due to network glitches or new deployments)
const lazyWithRetry = (importFunc) => {
  return lazy(async () => {
    try {
      return await importFunc()
    } catch (error) {
      console.error('[LazyRetry] Chunk load failed, retrying import:', error)
      try {
        // Retry once after a brief delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return await importFunc()
      } catch (retryError) {
        console.error('[LazyRetry] Chunk load failed after retry. Reloading page...', retryError)
        window.location.reload()
        return new Promise(() => {}) // Keep promise pending to prevent app from crashing before reload
      }
    }
  })
}

// Lazy loaded page components
const GetStarted = lazyWithRetry(() => import('./components/pages/GetStarted'))
const ServiceDetail = lazyWithRetry(() => import('./components/pages/ServiceDetail'))
const CaseStudyDetail = lazyWithRetry(() => import('./components/pages/CaseStudyDetail'))
const ClientLogin = lazyWithRetry(() => import('./components/features/ClientLogin'))
const ClientDashboard = lazyWithRetry(() => import('./components/features/ClientDashboard'))
const RefundRequest = lazyWithRetry(() => import('./components/pages/RefundRequest'))
const Reviews = lazyWithRetry(() => import('./components/pages/Reviews'))
const DiscoveryCall = lazyWithRetry(() => import('./components/pages/DiscoveryCall'))
const FounderProfile = lazyWithRetry(() => import('./components/pages/FounderProfile'))
const ResourceVault = lazyWithRetry(() => import('./components/pages/ResourceVault'))
const AuditWizard = lazyWithRetry(() => import('./components/pages/AuditWizard'))
const AdminLogin = lazyWithRetry(() => import('./components/pages/admin/AdminLogin'))
const AdminDashboard = lazyWithRetry(() => import('./components/pages/admin/AdminDashboard'))

// Lazy loaded home sections
const ClientWinsTicker = lazyWithRetry(() => import('./components/features/ClientWinsTicker'))
const Portfolio = lazyWithRetry(() => import('./components/features/Portfolio'))
const ClientProjects = lazyWithRetry(() => import('./components/sections/ClientProjects'))
const Process = lazyWithRetry(() => import('./components/sections/Process'))
const Pricing = lazyWithRetry(() => import('./components/sections/Pricing'))
const Testimonials = lazyWithRetry(() => import('./components/sections/Testimonials'))
const About = lazyWithRetry(() => import('./components/sections/About'))
const CTA = lazyWithRetry(() => import('./components/sections/CTA'))
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
        <meta name="keywords" content="G-One Media, digital marketing agency, web design agency, app development, SEO optimization, high-converting websites" />
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
      
      <LazySection placeholderHeight="80px">
        <ClientWinsTicker />
      </LazySection>

      <Portfolio />

      <ClientProjects />

      <LazySection placeholderHeight="500px">
        <Process />
      </LazySection>

      <Pricing onScheduleCall={onScheduleCall} />

      <Testimonials />

      <About />

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
          
          // Manage accessibility focus
          el.setAttribute('tabindex', '-1')
          el.focus({ preventScroll: true })

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

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AdminAuthProvider>
          <div className="min-h-screen relative">
            <ScrollToTop />
            {!isAdminRoute && <Navbar onScheduleCall={handleScheduleCall} />}
            {!isAdminRoute && <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />}

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
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            {!isAdminRoute && <Footer />}

            {/* Global AI Chat Widget */}
            {!isAdminRoute && <AIChatWidget />}
            
            {!isAdminRoute && <CookieBanner />}
          </div>
        </AdminAuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
