import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import LoadingOverlay from './LoadingOverlay'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const navigate = useNavigate()
  const { user, authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/admin/entry_255081')
        return
      }

      if (requiredRole) {
        const allowed = (user.role === requiredRole) || (requiredRole === 'admin' && user.role === 'super_admin')
        if (!allowed) {
          toast.error('Access denied. Insufficient privileges.')
          navigate('/admin/dashboard')
        }
      }
    }
  }, [authLoading, user, requiredRole, navigate])

  // Show non-blocking overlay while verifying access; keep children rendered
  return (
    <>
      {children}
      <LoadingOverlay visible={authLoading} message="Verifying access..." center />
    </>
  )
}