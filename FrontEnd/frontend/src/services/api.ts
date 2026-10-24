import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5128/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const saved = localStorage.getItem('auth')
  if (saved) {
    const { token } = JSON.parse(saved)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
