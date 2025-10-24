import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

export default function Settings() {
  const [settings, setSettings] = useState({})
  const [votingSettings, setVotingSettings] = useState({
    church_voting_active: false,
    national_voting_active: false,
    church_voting_lock_message: '',
    national_voting_lock_message: ''
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()
  const { user, authLoading } = useAuth()

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      const [profileRes, settingsRes, votingStatusRes] = await Promise.all([
        api.adminProfile(),
        api.getPublicResultsSettings(),
        api.getVotingStatus()
      ])

      setUserRole(profileRes?.user?.role || null)
      const settingsData = {
        public_results_enabled: !!settingsRes?.public_results_enabled,
      }
      setSettings(settingsData)
      
      // Set voting settings from status response
      setVotingSettings({
        church_voting_active: votingStatusRes?.church_voting?.active || false,
        national_voting_active: votingStatusRes?.national_voting?.active || false,
        church_voting_lock_message: votingStatusRes?.church_voting?.lock_message || '',
        national_voting_lock_message: votingStatusRes?.national_voting?.lock_message || ''
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      const msg = error?.message || 'Failed to load settings'
      if (msg === 'Unauthorized') {
        toast.error('Session expired. Please login again.')
        navigate('/admin/login')
        return
      }
      if (msg === 'Forbidden') {
        toast.error('Access denied. Super admin privileges required.')
        navigate('/admin/dashboard')
        return
      }
      toast.error('Failed to load settings')
      setSettings({})
      setVotingSettings({
        church_voting_active: false,
        national_voting_active: false,
        church_voting_lock_message: '',
        national_voting_lock_message: ''
      })
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!authLoading && user) {
      loadSettings()
    }
  }, [loadSettings, authLoading, user])

  const handleSettingsUpdate = async (value) => {
    if (userRole !== 'super_admin') {
      toast.error('Only super admins can update this setting.')
      return
    }
    try {
      setUpdating(true)
      await api.updatePublicResultsSettings({ enabled: value })
      setSettings(prev => ({ ...prev, public_results_enabled: value }))
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('Error updating settings:', error)
      const msg = error?.message || 'Failed to update settings'
      if (msg === 'Unauthorized') {
        toast.error('Session expired. Please login again.')
        navigate('/admin/login')
      } else if (msg === 'Forbidden') {
        toast.error('Access denied. Super admin privileges required.')
      } else {
        toast.error('Failed to update settings')
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleVotingToggle = async (type) => {
    if (userRole !== 'super_admin') {
      toast.error('Only super admins can toggle voting.')
      return
    }
    try {
      setUpdating(true)
      // Get current status and toggle it
      const currentStatus = votingSettings[`${type}_voting_active`]
      const newStatus = !currentStatus
      
      await api.toggleVoting({ type, active: newStatus })
      // Reload settings to get updated status
      await loadSettings()
      toast.success(`${type === 'church' ? 'Church' : 'National'} voting ${newStatus ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      console.error('Error toggling voting:', error)
      const msg = error?.message || 'Failed to toggle voting'
      if (msg === 'Unauthorized') {
        toast.error('Session expired. Please login again.')
        navigate('/admin/login')
      } else if (msg === 'Forbidden') {
        toast.error('Access denied. Super admin privileges required.')
      } else {
        toast.error('Failed to toggle voting')
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleLockMessageUpdate = async (type, message) => {
    if (userRole !== 'super_admin') {
      toast.error('Only super admins can update lock messages.')
      return
    }
    try {
      setUpdating(true)
      await api.updateVotingLockMessages({ 
        [`${type}_voting_lock_message`]: message 
      })
      setVotingSettings(prev => ({ 
        ...prev, 
        [`${type}_voting_lock_message`]: message 
      }))
      toast.success('Lock message updated successfully')
    } catch (error) {
      console.error('Error updating lock message:', error)
      const msg = error?.message || 'Failed to update lock message'
      if (msg === 'Unauthorized') {
        toast.error('Session expired. Please login again.')
        navigate('/admin/login')
      } else if (msg === 'Forbidden') {
        toast.error('Access denied. Super admin privileges required.')
      } else {
        toast.error('Failed to update lock message')
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Configure system-wide settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                <p className="text-sm text-gray-500">Configure system behavior and visibility</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Public Results Visibility */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Public Results Visibility</h3>
                <p className="text-sm text-gray-500">
                  Allow the public to view voting results without authentication
                </p>
                {userRole !== 'super_admin' && (
                  <p className="mt-2 text-xs text-red-600">Requires super admin privileges to change.</p>
                )}
              </div>
              <div className="sm:ml-4">
                <label className={`relative inline-flex items-center ${userRole !== 'super_admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                  <input
                    type="checkbox"
                    checked={settings.public_results_enabled || false}
                    onChange={(e) => handleSettingsUpdate(e.target.checked)}
                    disabled={userRole !== 'super_admin' || updating}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Additional Settings Placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">More Settings Coming Soon</h3>
              <p className="text-sm text-gray-500">
                Additional system configuration options will be available here
              </p>
            </div>
          </div>
        </div>

        {/* Voting Management Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Voting Management</h2>
                <p className="text-sm text-gray-500">Control voting access and display custom messages</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Church Voting Controls */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">Church Voting</h3>
                  <p className="text-sm text-gray-500">
                    Control access to church voting and set custom lock message
                  </p>
                  {userRole !== 'super_admin' && (
                    <p className="mt-2 text-xs text-red-600">Requires super admin privileges to change.</p>
                  )}
                </div>
                <div className="sm:ml-4">
                  <label className={`relative inline-flex items-center ${userRole !== 'super_admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={votingSettings.church_voting_active}
                      onChange={() => handleVotingToggle('church')}
                      disabled={userRole !== 'super_admin' || updating}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lock Message (shown when voting is disabled)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <input
                    type="text"
                    value={votingSettings.church_voting_lock_message}
                    onChange={(e) => setVotingSettings(prev => ({ ...prev, church_voting_lock_message: e.target.value }))}
                    placeholder="Enter message to display when church voting is locked..."
                    disabled={userRole !== 'super_admin'}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${userRole !== 'super_admin' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  <button
                    onClick={() => handleLockMessageUpdate('church', votingSettings.church_voting_lock_message)}
                    disabled={userRole !== 'super_admin' || updating}
                    className={`w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${userRole !== 'super_admin' || updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>

            {/* National Voting Controls */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">National Voting</h3>
                  <p className="text-sm text-gray-500">
                    Control access to national voting and set custom lock message
                  </p>
                  {userRole !== 'super_admin' && (
                    <p className="mt-2 text-xs text-red-600">Requires super admin privileges to change.</p>
                  )}
                </div>
                <div className="sm:ml-4">
                  <label className={`relative inline-flex items-center ${userRole !== 'super_admin' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input
                      type="checkbox"
                      checked={votingSettings.national_voting_active}
                      onChange={() => handleVotingToggle('national')}
                      disabled={userRole !== 'super_admin' || updating}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lock Message (shown when voting is disabled)
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <input
                    type="text"
                    value={votingSettings.national_voting_lock_message}
                    onChange={(e) => setVotingSettings(prev => ({ ...prev, national_voting_lock_message: e.target.value }))}
                    placeholder="Enter message to display when national voting is locked..."
                    disabled={userRole !== 'super_admin'}
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${userRole !== 'super_admin' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  <button
                    onClick={() => handleLockMessageUpdate('national', votingSettings.national_voting_lock_message)}
                    disabled={userRole !== 'super_admin' || updating}
                    className={`w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${userRole !== 'super_admin' || updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}