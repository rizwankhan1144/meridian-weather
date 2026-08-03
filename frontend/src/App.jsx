import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from '@/components/ProtectedRoute.jsx'
import PublicRoute from '@/components/PublicRoute.jsx'
import Login from '@/pages/Login.jsx'
import Register from '@/pages/Register.jsx'
import Dashboard from '@/pages/Dashboard.jsx'
import VerifyEmail from '@/pages/VerifyEmail.jsx'
import NotFound from '@/pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#121b2e',
            color: '#e8edf4',
            border: '1px solid #1f2b40',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#4fd1c5', secondary: '#121b2e' } },
          error: { iconTheme: { primary: '#f2545b', secondary: '#121b2e' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
