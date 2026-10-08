import type { Cliente } from '../types/Cliente'
import { UsersIcon } from './Icon'

interface Props {
  clientes: Cliente[]
  loading: boolean
}

function ClienteList({
  clientes,
  loading
}: Props) {

  if (loading) {
    return (
      <div className="list-status">
        Carregando clientes...
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="list-empty">

        <div className="empty-icon">
          <UsersIcon size={30} />
        </div>

        <strong>
          Nenhum cliente cadastrado
        </strong>

        <p>
          Cadastre seu primeiro cliente.
        </p>

      </div>
    )
  }

  return (
    <ul className="app-list">

      {clientes.map(cliente => (

        <li
          className="app-list-item"
          key={cliente.id}
        >

          <div className="list-avatar cliente-avatar">
          <UsersIcon size={19} />
          </div>

          <div className="list-info">

            <strong>
              {cliente.nome}
            </strong>

            <span>
              {cliente.email}
            </span>

            {cliente.cpf && (
              <small>
                CPF: {cliente.cpf}
              </small>
            )}

          </div>

          <span className="list-badge">
            Cliente
          </span>

        </li>

      ))}

    </ul>
  )
}

export default ClienteList