import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext.jsx'
import LoadingScreen from '@/components/LoadingScreen.jsx'

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
