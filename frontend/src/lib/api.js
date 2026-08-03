import axios from 'axios'

// Use the environment variable if available. Otherwise, dynamically use the current
// hostname (e.g., 'localhost' or '192.168.x.x') so it works automatically on local networks.
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

// Attach the JWT to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a request comes back unauthorized, clear the stored session so the
// route guards redirect the user back to login on the next render.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  },
)

export default api
