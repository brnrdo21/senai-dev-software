
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5128/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    // Recupera os dados de autenticação
    const saved = localStorage.getItem('auth')

    if (saved) {
      try {
        const auth = JSON.parse(saved)

        // Recupera o token
        const token = auth.token || auth.accessToken

        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`)
          console.log('JWT enviado na requisição:', config.url)
        } else {
          console.error('Token não encontrado dentro de auth')
        }

      } catch (error) {
        console.error('Erro ao ler autenticação:', error)
      }
    } else {
      console.error('Nenhum dado de autenticação encontrado')
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api
