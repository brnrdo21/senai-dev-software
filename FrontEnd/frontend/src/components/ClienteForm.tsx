import { useState } from 'react'
import { clienteService } from '../services/ClienteService'
import { UserPlusIcon } from './Icon'

interface Props {
  onClienteCriado: () => void
}

function ClienteForm({ onClienteCriado }: Props) {

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')

  const [loading, setLoading] =
    useState(false)

  const [erro, setErro] =
    useState<string | null>(null)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault()
    setErro(null)

    try {

      setLoading(true)

      await clienteService.criar({
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpf.trim()
      })

      setNome('')
      setEmail('')
      setCpf('')

      onClienteCriado()

    } catch {

      setErro(
        'Erro ao cadastrar cliente. Tente novamente.'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
  <form
    className="app-form"
    onSubmit={handleSubmit}
  >

    <div className="form-header">
      <div>
        <h2>Cadastrar Cliente</h2>

        <p>
          Adicione um novo cliente ao sistema
        </p>
      </div>
    </div>

    {erro && (
      <div className="form-error">
        {erro}
      </div>
    )}

    <div className="form-group">
      <label htmlFor="cliente-nome">
        Nome
      </label>

      <input
        id="cliente-nome"
        type="text"
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Nome completo"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="cliente-email">
        E-mail
      </label>

      <input
        id="cliente-email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="cliente@email.com"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="cliente-cpf">
        CPF
      </label>

      <input
        id="cliente-cpf"
        type="text"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        placeholder="000.000.000-00"
      />
    </div>

    <button
      className="form-button"
      type="submit"
      disabled={loading}
    >
      {loading ? 'Salvando...' : 'Cadastrar cliente'}
    </button>

  </form>
)
}
export default ClienteForm