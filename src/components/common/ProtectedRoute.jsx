import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function ProtectedRoute() {
  const { admin } = useAdminAuth()

  if (!admin) {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
