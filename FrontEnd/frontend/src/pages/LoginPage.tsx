
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/AuthService'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const resposta = await authService.login({ email, senha })
      login(resposta)
      navigate('/produtos')
    } catch {
      setErro('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <aside className="login-sidebar">
        <div className="login-logo">
          <span>M</span>
          <strong>Meu App</strong>
        </div>

        <div className="login-decoration" />
        <div className="login-decoration login-decoration-bottom" />
        <div className="login-line">
          <span />
        </div>
      </aside>

      <section className="login-main">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-icon">M</div>

          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <div className="login-input">
              <span aria-hidden="true">✉</span>
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>
            <div className="login-input">
              <span aria-hidden="true">♙</span>
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          {erro && <p className="login-error">{erro}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
            {!loading && <span>→</span>}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
