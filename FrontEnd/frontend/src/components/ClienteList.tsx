
import type { Cliente } from '../types/Cliente'

interface Props {
  clientes: Cliente[]
  loading: boolean
}

function ClienteList({ clientes, loading }: Props) {

  if (loading) {
    return (
      <div className="list-status">
        Carregando clientes...
      </div>
    )
  }

  const listaClientes = Array.isArray(clientes)
    ? clientes
    : []

  if (listaClientes.length === 0) {
    return (
      <div className="list-empty">
        <strong>Nenhum cliente cadastrado</strong>
        <p>Cadastre seu primeiro cliente.</p>
      </div>
    )
  }

  return (
    <ul className="app-list clients-list">
      {listaClientes.map((cliente) => (
        <li
          className="app-list-item client-item"
          key={cliente.id}
        >
          <div className="client-info">

            <div className="client-top">
              <strong className="client-name">
                {cliente.nome}
              </strong>

              <span className="client-badge">
                Cliente
              </span>
            </div>

            <div className="client-email">
              {cliente.email}
            </div>

            {cliente.cpf && (
              <div className="client-document">
                <span>CPF</span>
                <strong>{cliente.cpf}</strong>
              </div>
            )}

          </div>
        </li>
      ))}
    </ul>
  )
}

export default ClienteList
