
import type { Venda } from '../types/Venda'
import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'

interface Props {
  vendas: Venda[]
  clientes: Cliente[]
  produtos: Produto[]
  loading: boolean
}

function VendaList({
  vendas,
  clientes,
  produtos,
  loading
}: Props) {

  function moeda(valor: number) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  function dataFormatada(data: Date | string) {
    const dataVenda = new Date(data)

    if (Number.isNaN(dataVenda.getTime())) {
      return '—'
    }

    return dataVenda.toLocaleDateString('pt-BR')
  }

  return (
    <section className="sales-card sales-history">

      <div className="sales-card-header">
        <div>
          <span className="sales-eyebrow">
            MOVIMENTAÇÕES
          </span>

          <h2>Histórico de vendas</h2>

          <p>
            Acompanhe as vendas registradas no sistema.
          </p>
        </div>

        <span className="sales-count">
          {vendas.length} {vendas.length === 1 ? 'venda' : 'vendas'}
        </span>
      </div>

      {loading ? (
        <div className="sales-empty">
          Carregando vendas...
        </div>
      ) : vendas.length === 0 ? (
        <div className="sales-empty">
          <strong>Nenhuma venda registrada</strong>
          <p>As vendas realizadas aparecerão aqui.</p>
        </div>
      ) : (

        <div className="sales-list">

          {vendas.map(venda => {

            const cliente = clientes.find(
              item => String(item.id) === String(venda.clienteId)
            )

            const produto = produtos.find(
              item => String(item.id) === String(venda.produtoId)
            )

            return (
              <article
                className="sale-item"
                key={venda.id}
              >

                <div className="sale-top">

                  <div>
                    <span className="sale-label">
                      IDENTIFICAÇÃO DA VENDA
                    </span>

                    <strong className="sales-id">
                      #{String(venda.id).padStart(3, '0')}
                    </strong>
                  </div>

                  <span className="sale-date">
                    {dataFormatada(venda.data_venda)}
                  </span>

                </div>

                <div className="sale-value">
                  {moeda(venda.valor_total)}
                </div>

                <div className="sale-details">

                  <div className="sale-detail">
                    <span>Cliente</span>
                    <strong>
                      {cliente?.nome ?? `Cliente #${venda.clienteId}`}
                    </strong>
                  </div>

                  <div className="sale-detail">
                    <span>Produto</span>
                    <strong>
                      {produto?.nome ?? `Produto #${venda.produtoId}`}
                    </strong>
                  </div>

                  <div className="sale-detail">
                    <span>Quantidade</span>
                    <strong>
                      {venda.quantidade} unidades
                    </strong>
                  </div>

                </div>

              </article>
            )
          })}

        </div>
      )}

    </section>
  )
}

export default VendaList
