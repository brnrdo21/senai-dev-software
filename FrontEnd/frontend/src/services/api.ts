
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5128/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  // Login não precisa de token anterior
  if (config.url?.toLowerCase().includes('/auth/login')) {
    return config
  }

  const saved = localStorage.getItem('auth')

  if (saved) {
    try {
      const auth = JSON.parse(saved)

      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
      }
    } catch {
      localStorage.removeItem('auth')
    }
  }

  return config
})

export default api
