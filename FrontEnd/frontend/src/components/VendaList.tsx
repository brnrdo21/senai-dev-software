
import type { Venda } from '../types/Venda'
import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'

interface Props {
  vendas: Venda[]
  clientes: Cliente[]
  produtos: Produto[]
  loading: boolean
}

function VendaList({ vendas, clientes, produtos, loading }: Props) {
  function moeda(valor: number) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function dataFormatada(data: Date | string) {
    const dataVenda = new Date(data)

    if (Number.isNaN(dataVenda.getTime())) return '—'

    return dataVenda.toLocaleDateString('pt-BR')
  }

  return (
    <section className="sales-card sales-history">
      <div className="sales-card-header">
        <div>
          <span className="sales-eyebrow">MOVIMENTAÇÕES</span>
          <h2>Histórico de vendas</h2>
          <p>Acompanhe as vendas registradas no sistema.</p>
        </div>

        <span className="sales-count">
          {vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'}
        </span>
      </div>

      {loading ? (
        <div className="sales-empty">Carregando vendas...</div>
      ) : vendas.length === 0 ? (
        <div className="sales-empty">
          <div className="sales-empty-mark">—</div>
          <strong>Nenhuma venda registrada</strong>
          <p>As vendas realizadas aparecerão aqui.</p>
        </div>
      ) : (
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Venda</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Valor total</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {vendas.map(venda => {
               const cliente = clientes.find(
                item => String(item.id) === String(venda.clienteId)
                )

                const produto = produtos.find(
                item => String(item.id) === String(venda.produtoId)
                )
                return (
                  <tr key={venda.id}>
                    <td>
                      <span className="sales-id">
                        #{String(venda.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td>{cliente?.nome ?? `Cliente #${venda.clienteId}`}</td>
                    <td>{produto?.nome ?? `Produto #${venda.produtoId}`}</td>
                    <td>{venda.quantidade}</td>
                    <td className="sales-value">
                      {moeda(venda.valor_total)}
                    </td>
                    <td>{dataFormatada(venda.data_venda)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default VendaList
