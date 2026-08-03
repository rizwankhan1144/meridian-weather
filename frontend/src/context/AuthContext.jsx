import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '@/lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  // Until we've confirmed the stored token against the server, treat auth
  // state as unknown so route guards don't flash the wrong screen.
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('access_token')))

  const persistSession = useCallback((accessToken, userData) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(accessToken)
    setUser(userData)
  }, [])

  const clearSession = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    // Validate the stored token once on load; if it's expired or revoked,
    // fall back to the logged-out state.
    async function verify() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const { data } = await api.get('/profile')
        setUser(data.user ?? data)
        localStorage.setItem('user', JSON.stringify(data.user ?? data))
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    persistSession(data.access_token, data.user)
    return data
  }

  async function register(payload) {
    const { data } = await api.post('/register', payload)
    return data
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      clearSession()
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
