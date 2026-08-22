import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  Loader2, 
  Mail, 
  User, 
  Lock, 
  Key, 
  AlertCircle,
  Eye, 
  EyeOff, 
  Sparkles
} from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import { useAdminAuth, AVAILABLE_PERMISSIONS, ROLE_PRESETS } from '../../../context/AdminAuthContext'

export default function AdminPermissionsManager() {
  const { profile: currentAdminProfile, isSuperAdmin, refreshProfile } = useAdminAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [admins, setAdmins] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
    permissions: ROLE_PRESETS.editor.permissions,
    is_active: true,
  })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      if (data) setAdmins(data)
    } catch (err) {
      console.error('Error fetching admin users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      permissions: [...ROLE_PRESETS.editor.permissions],
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin)
    const perms = Array.isArray(admin.permissions) ? admin.permissions : []
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      password: '',
      role: admin.role || 'custom',
      permissions: perms.includes('*') ? ['*'] : perms,
      is_active: admin.is_active !== undefined ? admin.is_active : true,
    })
    setIsModalOpen(true)
  }

  const handleRoleChange = (selectedRole) => {
    if (selectedRole === 'super_admin') {
      setFormData({
        ...formData,
        role: selectedRole,
        permissions: ['*'],
      })
    } else if (ROLE_PRESETS[selectedRole]) {
      setFormData({
        ...formData,
        role: selectedRole,
        permissions: [...ROLE_PRESETS[selectedRole].permissions],
      })
    } else {
      setFormData({
        ...formData,
        role: 'custom',
      })
    }
  }

  const handleTogglePermission = (permId) => {
    let updatedPerms = [...(formData.permissions || [])]

    if (updatedPerms.includes('*')) {
      // If was super admin wildcard, convert to all except the unselected one
      updatedPerms = AVAILABLE_PERMISSIONS.map((p) => p.id).filter((id) => id !== permId)
      setFormData({ ...formData, role: 'custom', permissions: updatedPerms })
      return
    }

    if (updatedPerms.includes(permId)) {
      updatedPerms = updatedPerms.filter((id) => id !== permId)
    } else {
      updatedPerms.push(permId)
    }

    // Check if matches a preset or is custom
    setFormData({
      ...formData,
      role: 'custom',
      permissions: updatedPerms,
    })
  }

  const handleToggleActive = async (admin) => {
    if (admin.email === currentAdminProfile?.email) {
      alert('You cannot deactivate your own administrative account.')
      return
    }
    try {
      const updated = !admin.is_active
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: updated })
        .eq('id', admin.id)

      if (error) throw error
      setAdmins(admins.map((a) => (a.id === admin.id ? { ...a, is_active: updated } : a)))
      refreshProfile()
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    }
  }

  const handleDelete = async (admin) => {
    if (admin.email === currentAdminProfile?.email) {
      alert('You cannot delete your own account.')
      return
    }
    if (!window.confirm(`Are you sure you want to revoke and delete admin access for ${admin.name} (${admin.email})?`)) {
      return
    }
    try {
      const { error } = await supabase.from('admin_users').delete().eq('id', admin.id)
      if (error) throw error
      setAdmins(admins.filter((a) => a.id !== admin.id))
      refreshProfile()
    } catch (err) {
      alert('Failed to delete admin: ' + err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const targetEmail = formData.email.trim().toLowerCase()
      const payload = {
        name: formData.name.trim(),
        email: targetEmail,
        role: formData.role,
        permissions: formData.permissions,
        is_active: Boolean(formData.is_active),
      }

      if (editingAdmin) {
        const { error } = await supabase
          .from('admin_users')
          .update(payload)
          .eq('id', editingAdmin.id)

        if (error) throw error
      } else {
        // Insert into database
        const { error } = await supabase
          .from('admin_users')
          .insert([payload])

        if (error) throw error

        // If a password was provided, attempt to register in Supabase Auth
        if (formData.password && formData.password.length >= 6) {
          try {
            await supabase.auth.signUp({
              email: targetEmail,
              password: formData.password,
              options: {
                data: { full_name: formData.name.trim() }
              }
            })
          } catch (authErr) {
            console.warn('Auth sign up note:', authErr)
          }
        }
      }

      setIsModalOpen(false)
      fetchAdmins()
      refreshProfile()
    } catch (err) {
      console.error('Error saving admin:', err)
      alert('Failed to save administrator: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const getRoleBadge = (role, perms) => {
    if (role === 'super_admin' || (perms || []).includes('*')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          <ShieldCheck size={12} /> Super Admin
        </span>
      )
    }
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <Shield size={12} /> Administrator
        </span>
      )
    }
    if (role === 'editor') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Edit3 size={12} /> Content Editor
        </span>
      )
    }
    if (role === 'support') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Mail size={12} /> Support & Leads
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <Key size={12} /> Custom Role
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-cyan-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            <Shield className="text-cyan-400" size={24} />
            Administrators & Permissions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
            Manage authorized staff accounts, role assignments, and granular dashboard permissions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-400 text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 w-fit"
        >
          <UserPlus size={16} /> Add Administrator
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Admins', value: admins.length, desc: 'Registered accounts' },
          { label: 'Super Admins', value: admins.filter((a) => a.role === 'super_admin' || (a.permissions || []).includes('*')).length, desc: 'Full root access' },
          { label: 'Content Editors', value: admins.filter((a) => a.role === 'editor').length, desc: 'Media & copy staff' },
          { label: 'Active Status', value: admins.filter((a) => a.is_active).length, desc: 'Can sign in today' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl glass-card border border-white/5 bg-black/20">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              {stat.label}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{stat.value}</div>
            <div className="text-[11px] text-[var(--text-secondary)]">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Admin Roster List */}
      <div className="space-y-4">
        {admins.map((adminUser) => {
          const isMe = adminUser.email === currentAdminProfile?.email
          const isUserSuperAdmin = adminUser.role === 'super_admin' || (adminUser.permissions || []).includes('*')
          const perms = Array.isArray(adminUser.permissions) ? adminUser.permissions : []

          return (
            <div
              key={adminUser.id}
              className={`p-5 sm:p-6 rounded-3xl glass-card border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                adminUser.is_active ? 'border-white/10' : 'border-red-500/30 opacity-60 bg-red-950/10'
              }`}
            >
              {/* Left Profile Info */}
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <User className="text-cyan-400" size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-white">{adminUser.name}</h3>
                    {isMe && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-cyan-300 border border-cyan-400/30">
                        You
                      </span>
                    )}
                    {getRoleBadge(adminUser.role, adminUser.permissions)}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      adminUser.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {adminUser.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                    <Mail size={12} className="opacity-70" /> {adminUser.email}
                  </p>
                </div>
              </div>

              {/* Middle: Permission Badges */}
              <div className="flex-1 max-w-xl">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Granted Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {isUserSuperAdmin ? (
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles size={11} /> Unrestricted Full Access
                    </span>
                  ) : perms.length === 0 ? (
                    <span className="text-[11px] text-[var(--text-muted)] italic">No permissions assigned</span>
                  ) : (
                    perms.map((pKey) => {
                      const meta = AVAILABLE_PERMISSIONS.find((p) => p.id === pKey)
                      return (
                        <span
                          key={pKey}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-[var(--text-secondary)] font-medium"
                        >
                          {meta?.label || pKey}
                        </span>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 justify-end">
                <button
                  onClick={() => handleToggleActive(adminUser)}
                  disabled={isMe}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    adminUser.is_active
                      ? 'bg-white/5 text-[var(--text-secondary)] hover:text-white'
                      : 'bg-emerald-500/20 text-emerald-300'
                  } disabled:opacity-30 disabled:cursor-not-allowed`}
                  title={adminUser.is_active ? 'Suspend admin' : 'Activate admin'}
                >
                  {adminUser.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>

                <button
                  onClick={() => handleOpenEdit(adminUser)}
                  className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all cursor-pointer"
                  title="Edit permissions"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => handleDelete(adminUser)}
                  disabled={isMe}
                  className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Revoke access"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Add or Edit Admin User */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-3xl glass-card border border-white/10 shadow-2xl bg-[var(--bg-primary)] max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[var(--bg-primary)] shrink-0">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {editingAdmin ? `Edit Permissions: ${editingAdmin.name}` : 'Add Administrator'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                    Configure staff identity and select granted dashboard permissions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        disabled={Boolean(editingAdmin)}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alex@g-onemedia.com"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Password (for new admin) */}
                  {!editingAdmin && (
                    <div>
                      <label className="font-bold text-[var(--text-secondary)] block mb-1">
                        Initial Login Password (optional, min 6 chars)
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Leave blank or enter secure password"
                        className="w-full px-3.5 py-2.5 bg-black/20 border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] outline-none focus:border-cyan-400"
                      />
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        The admin can also be provisioned via terminal CLI anytime using <code className="text-cyan-300">npm run create-admin</code>.
                      </p>
                    </div>
                  )}

                  {/* Role Preset Selector */}
                  <div>
                    <label className="font-bold text-[var(--text-secondary)] block mb-2">Role Preset</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { id: 'super_admin', label: 'Super Admin', desc: 'Full root access' },
                        { id: 'admin', label: 'Administrator', desc: 'Manage all content' },
                        { id: 'editor', label: 'Content Editor', desc: 'Copy & portfolio' },
                        { id: 'support', label: 'Support Lead', desc: 'Inquiries & calls' },
                      ].map((preset) => {
                        const isSelected = formData.role === preset.id
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleRoleChange(preset.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                                : 'bg-black/20 border-white/5 text-[var(--text-muted)] hover:border-white/20'
                            }`}
                          >
                            <div className={`font-bold text-xs ${isSelected ? 'text-cyan-300' : 'text-[var(--text-primary)]'}`}>
                              {preset.label}
                            </div>
                            <div className="text-[10px] opacity-70 mt-0.5">{preset.desc}</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Granular Permissions Matrix */}
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                        <Key size={14} /> Granular Permission Controls
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {formData.permissions.includes('*') ? 'All 8 features granted' : `${formData.permissions.length} of 8 granted`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {AVAILABLE_PERMISSIONS.map((perm) => {
                        const isChecked = formData.permissions.includes('*') || formData.permissions.includes(perm.id)
                        return (
                          <label
                            key={perm.id}
                            className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-cyan-950/30 border-cyan-500/40 text-white'
                                : 'bg-black/20 border-white/5 text-[var(--text-muted)] hover:bg-white/5'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm.id)}
                              className="mt-0.5 w-4 h-4 rounded text-cyan-400 bg-black/40 border-white/10 cursor-pointer"
                            />
                            <div>
                              <div className={`font-bold text-xs ${isChecked ? 'text-cyan-300' : 'text-[var(--text-primary)]'}`}>
                                {perm.label}
                              </div>
                              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug">
                                {perm.desc}
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Active Status Toggle */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="checkbox"
                      id="admin_active_toggle"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-400 bg-black/40 border-white/10 cursor-pointer"
                    />
                    <label htmlFor="admin_active_toggle" className="font-bold text-[var(--text-primary)] cursor-pointer">
                      Account Active (Permitted to sign in to admin dashboard)
                    </label>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 sm:p-5 bg-[var(--bg-primary)] border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Administrator
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
