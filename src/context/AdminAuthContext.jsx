import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AdminAuthContext = createContext()

export const AVAILABLE_PERMISSIONS = [
  { id: 'manage_hero', label: 'Hero Copy & Headlines', desc: 'Edit homepage headlines, subheadlines, and CTAs' },
  { id: 'manage_pricing', label: 'Pricing Packages', desc: 'Add, update, or reorder tiered pricing packages & multi-currency rates' },
  { id: 'manage_services', label: 'Individual Services', desc: 'Manage agency deliverables, service items, and prices' },
  { id: 'manage_team', label: 'Team & Founders', desc: 'Manage founders, team members, bios, skills, and social links' },
  { id: 'manage_portfolio', label: 'Portfolio & Case Studies', desc: 'Add or modify showcase projects and deep-dive case studies' },
  { id: 'manage_reviews', label: 'Testimonials & Reviews', desc: 'Approve, moderate, or create client feedback and ratings' },
  { id: 'manage_leads', label: 'Leads & Discovery Calls', desc: 'Access and export incoming client inquiries and scheduled calls' },
  { id: 'manage_admins', label: 'Admins & Permissions', desc: 'Invite new administrators, change roles, and edit permission access' },
]

export const ROLE_PRESETS = {
  super_admin: {
    label: 'Super Admin',
    desc: 'Unrestricted full access to all admin tools, data, and permission settings',
    permissions: ['*'],
  },
  admin: {
    label: 'Administrator',
    desc: 'Full access to content management, leads, team, and reviews',
    permissions: [
      'manage_hero',
      'manage_pricing',
      'manage_services',
      'manage_team',
      'manage_portfolio',
      'manage_reviews',
      'manage_leads',
    ],
  },
  editor: {
    label: 'Content Editor',
    desc: 'Can edit copy, pricing, services, team bios, portfolio, and reviews',
    permissions: [
      'manage_hero',
      'manage_pricing',
      'manage_services',
      'manage_team',
      'manage_portfolio',
      'manage_reviews',
    ],
  },
  support: {
    label: 'Support & Inquiries',
    desc: 'Can view/manage incoming client leads, calls, and review moderation',
    permissions: ['manage_leads', 'manage_reviews'],
  },
  custom: {
    label: 'Custom Role',
    desc: 'Customized selection of granular permissions',
    permissions: [],
  },
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAdminProfile = async (user) => {
    if (!user?.email) {
      setProfile(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email.toLowerCase())
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        // Fallback profile if user is authenticated
        setProfile({
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
          role: 'super_admin',
          permissions: ['*'],
          is_active: true,
        })
      }
    } catch (err) {
      console.warn('Could not fetch admin_users profile:', err)
      setProfile({
        email: user.email,
        name: user.email.split('@')[0],
        role: 'super_admin',
        permissions: ['*'],
        is_active: true,
      })
    }
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setAdmin(currentUser)
      if (currentUser) {
        fetchAdminProfile(currentUser).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setAdmin(currentUser)
      if (currentUser) {
        fetchAdminProfile(currentUser).finally(() => setLoading(false))
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const isSuperAdmin = profile?.role === 'super_admin' || (profile?.permissions || []).includes('*')

  const hasPermission = (permissionKey) => {
    if (!profile) return false
    if (!profile.is_active) return false
    if (isSuperAdmin) return true
    const perms = Array.isArray(profile.permissions) ? profile.permissions : []
    return perms.includes(permissionKey)
  }

  const value = {
    admin,
    profile,
    loading,
    isSuperAdmin,
    hasPermission,
    refreshProfile: () => admin && fetchAdminProfile(admin),
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {!loading && children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  return useContext(AdminAuthContext)
}
