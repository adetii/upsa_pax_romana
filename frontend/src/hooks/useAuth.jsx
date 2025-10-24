import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const path = window.location.pathname
    const isAdminPath = path.startsWith('/admin')
    const isAdminAuthPage = path.includes('/admin/login')

    let mounted = true
    const hydrate = async () => {
      if (!isAdminPath || isAdminAuthPage) {
        if (mounted) setAuthLoading(false)
        return
      }

      try {
        const res = await api.adminProfile()
        const u = res?.user || res?.data?.user || res
        if (mounted) setUser(u || null)
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        if (mounted) setUser(null)
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }

    hydrate()
    return () => { mounted = false }
  }, [])

  const value = { user, setUser, authLoading }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}