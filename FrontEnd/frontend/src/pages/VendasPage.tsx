
import { useCallback, useEffect, useState } from 'react'
import type { Venda } from '../types/Venda'
import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'
import { vendaService } from '../services/VendaService'
import { clienteService } from '../services/ClienteService'
import { produtoService } from '../services/ProdutoService'
import VendaForm from '../components/VendaForm'
import VendaList from '../components/VendaList'

function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setErro('')

    try {
      const [listaVendas, listaClientes, listaProdutos] = await Promise.all([
        vendaService.listar(),
        clienteService.listar(),
        produtoService.listar()
      ])

      setVendas(Array.isArray(listaVendas) ? listaVendas : [])
      setClientes(Array.isArray(listaClientes) ? listaClientes : [])
      setProdutos(Array.isArray(listaProdutos) ? listaProdutos : [])
    } catch {
      setErro('Não foi possível carregar todos os dados. Verifique a conexão com a API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const faturamento = vendas.reduce(
    (total, venda) => total + Number(venda.valor_total || 0),
    0
  )

  const unidadesVendidas = vendas.reduce(
    (total, venda) => total + Number(venda.quantidade || 0),
    0
  )

  return (
    <main className="sales-page">
      <header className="sales-page-heading">
        <div>
          <span className="sales-eyebrow">GESTÃO COMERCIAL</span>
          <h1>Vendas</h1>
          <p>Registre operações e acompanhe o desempenho das vendas.</p>
        </div>

        <button
          className="sales-refresh"
          type="button"
          onClick={carregarDados}
          disabled={loading}
        >
          {loading ? 'Atualizando...' : 'Atualizar dados'}
        </button>
      </header>

      {erro && <p className="sales-message sales-error">{erro}</p>}

      <section className="sales-stats">
        <article className="sales-stat-card">
          <span>Vendas realizadas</span>
          <strong>{vendas.length}</strong>
          <small>Operações registradas</small>
        </article>

        <article className="sales-stat-card">
          <span>Faturamento registrado</span>
          <strong>
            {faturamento.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </strong>
          <small>Soma dos valores das vendas</small>
        </article>

        <article className="sales-stat-card">
          <span>Unidades vendidas</span>
          <strong>{unidadesVendidas}</strong>
          <small>Quantidade total de itens</small>
        </article>
      </section>

      <div className="sales-content-grid">
        <VendaForm onVendaCriada={carregarDados} />

        <VendaList
          vendas={vendas}
          clientes={clientes}
          produtos={produtos}
          loading={loading}
        />
      </div>
    </main>
  )
}

export default VendasPage
