import type { Venda } from '../types/Venda'
import { UsersIcon } from './Icon'

interface Props {
  vendas: Venda[]
  loading: boolean
}

function VendaList({
  vendas,
  loading
}: Props) {

  if (loading) {
    return (
      <div className="list-status">
        Carregando vendas...
      </div>
    )
  }

  if (vendas.length === 0) {
    return (
      <div className="list-empty">
        <div className="empty-icon">
          <UsersIcon size={30} />
        </div>

        <strong>
          Nenhuma venda cadastrada
        </strong>

        <p>
          Cadastre sua primeira venda.
        </p>
      </div>
    )
  }

  return (
    <ul className="app-list">
      {vendas.map((venda) => (
        <li
          className="app-list-item"
          key={venda.id}
        >
          <div className="list-avatar cliente-avatar">
            <UsersIcon size={19} />
          </div>

          <div className="list-info">
            <strong>
              Venda #{venda.id}
            </strong>

            <span>
              Cliente: {venda.clienteId}
            </span>

            <span>
              Produto: {venda.produtoId}
            </span>

            <span>
              Quantidade: {venda.quantidade}
            </span>

            <small>
              Total: {Number(venda.valor_total).toLocaleString(
                'pt-BR',
                {
                  style: 'currency',
                  currency: 'BRL'
                }
              )}
            </small>

            <small>
              Data: {new Date(venda.data_venda).toLocaleDateString(
                'pt-BR'
              )}
            </small>
          </div>

          <span className="list-badge">
            Venda
          </span>
        </li>
      ))}
    </ul>
  )
}

export default VendaList
