import React, { useEffect, useState } from 'react'

import { toast } from 'react-hot-toast'
import { Edit2,
  Save, 
  X, 
  Shield, 
  Mail,
  User, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff} from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import LoadingOverlay from '../../components/LoadingOverlay'

export default function AdminProfile() {
  // Remove local loading/user; use auth context
  const { user, setUser, authLoading } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  // Editable form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  


  useEffect(() => {
    if (user) {
      setName(user?.name || '')
      setEmail(user?.email || '')
    }
  }, [user])

  const getRoleBadge = (role) => {
    const config = role === 'super_admin'
      ? { bg: 'bg-gradient-to-r from-purple-500 to-pink-500', label: 'Super Admin', icon: Shield }
      : { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', label: 'Admin', icon: User }
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-white ${config.bg} shadow-lg`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!name?.trim()) { toast.error('Name is required'); return }
    if (!email?.trim()) { toast.error('Email is required'); return }

    const wantsPasswordChange = Boolean(newPassword)
    if (wantsPasswordChange) {
      if (!currentPassword) { toast.error('Current password is required to change password'); return }
      if (newPassword.length < 8) { toast.error('New password must be at least 8 characters'); return }
      if (newPassword !== confirmPassword) { toast.error('New password and confirmation do not match'); return }
    }

    try {
      setSaving(true)
      const payload = { name: name.trim(), email: email.trim() }
      if (wantsPasswordChange) {
        payload.current_password = currentPassword
        payload.password = newPassword
        payload.password_confirmation = confirmPassword
      }
      const res = await api.updateAdminProfile(payload)
      const updatedUser = res?.user || { ...user, name: payload.name, email: payload.email }
      setUser(updatedUser)
      setName(updatedUser?.name || '')
      setEmail(updatedUser?.email || '')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setEditMode(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      const msg = error?.message || 'Failed to update profile'
      toast.error(msg)
      console.error('Update profile error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setName(user?.name || '')
    setEmail(user?.email || '')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setEditMode(false)
  }


  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Profile loading overlay (corner) */}
      <LoadingOverlay visible={authLoading} message="Loading your profile..." position="top-right" />
      {/* Header with glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">My Profile</h1>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
              {editMode && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold disabled:opacity-50 text-sm"
                  >
                    <X className="w-4 h-4 mr-1.5" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-none flex items-center justify-center px-4 sm:px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg font-semibold disabled:opacity-50 text-sm"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1.5" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Tabs */}
        <div className="mb-4 sm:mb-6 bg-white rounded-xl sm:rounded-2xl shadow-lg p-1.5 sm:p-2 border border-gray-100">
          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'profile'
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Profile</span>
              <span className="xs:hidden">Info</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'security'
                  ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Security
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                <div className="relative">
                  <div className="flex flex-col items-center mb-5 sm:mb-6">
                    <div className="text-center mt-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-words">{user?.name || '—'}</h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">{user?.email || '—'}</p>
                      <div className="mt-3">
                        {user?.role && getRoleBadge(user.role)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 pt-5 sm:pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600" />
                        Role
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 capitalize">{user?.role?.replace('_', ' ') || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Account Information</h3>
                <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 items-center">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none font-medium text-sm sm:text-base"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                        />
                      ) : (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-100 rounded-xl bg-linear-to-r from-gray-50 to-slate-50 text-gray-900 font-medium text-sm sm:text-base wrap-break-words">
                          {user?.name || '—'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 items-center">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address
                      </label>
                      {editMode ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none font-medium text-sm sm:text-base"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-100 rounded-xl bg-linear-to-r from-gray-50 to-slate-50 text-gray-900 font-medium text-sm sm:text-base break-all">
                          {user?.email || '—'}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 items-center">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Role
                      </label>
                      <div className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-100 rounded-xl bg-linear-to-r from-gray-50 to-slate-50 text-gray-900 font-medium capitalize text-sm sm:text-base">
                        {user?.role?.replace('_', ' ') || '—'}
                      </div>
                    </div>

                    {user?.created_at && (
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 items-center">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Account Created
                        </label>
                        <div className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-100 rounded-xl bg-linear-to-r from-gray-50 to-slate-50 text-gray-900 font-medium text-sm sm:text-base wrap-break-words">
                          {new Date(user.created_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8">
              <div className="flex items-center mb-5 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-red-500 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shrink-0">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Security Settings</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Update your password</p>
                </div>
              </div>

              {!editMode ? (
                <div className="text-center py-8 sm:py-12">
                  <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">Click "Edit" to change your password</p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg font-semibold text-sm sm:text-base"
                  >
                    Edit Security Settings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none font-medium text-sm sm:text-base"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none font-medium text-sm sm:text-base"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none font-medium text-sm sm:text-base"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}