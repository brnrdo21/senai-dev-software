
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

  const erros: string[] = []

  try {
    const resultados = await Promise.allSettled([
      vendaService.listar(),
      clienteService.listar(),
      produtoService.listar()
    ])

    const [resultadoVendas, resultadoClientes, resultadoProdutos] =
      resultados

    if (resultadoVendas.status === 'fulfilled') {
      const dados = resultadoVendas.value
      if (Array.isArray(dados)) {
        setVendas(dados)
      } else {
        setVendas([])
        erros.push('Vendas: formato de resposta inválido.')
      }
    } else {
      setVendas([])
      erros.push('Vendas: falha ao consultar a API.')
      console.error('Erro ao carregar vendas:', resultadoVendas.reason)
    }

    if (resultadoClientes.status === 'fulfilled') {
      const dados = resultadoClientes.value
      if (Array.isArray(dados)) {
        setClientes(dados)
      } else {
        setClientes([])
        erros.push('Clientes: formato de resposta inválido.')
      }
    } else {
      setClientes([])
      erros.push('Clientes: falha ao consultar a API.')
      console.error('Erro ao carregar clientes:', resultadoClientes.reason)
    }

    if (resultadoProdutos.status === 'fulfilled') {
      const dados = resultadoProdutos.value
      if (Array.isArray(dados)) {
        setProdutos(dados)
      } else {
        setProdutos([])
        erros.push('Produtos: formato de resposta inválido.')
      }
    } else {
      setProdutos([])
      erros.push('Produtos: falha ao consultar a API.')
      console.error('Erro ao carregar produtos:', resultadoProdutos.reason)
    }

    if (erros.length > 0) {
      setErro(erros.join(' '))
    }
  } catch (error) {
    console.error('Erro ao carregar os dados:', error)
    setErro('Ocorreu um erro inesperado ao carregar os dados.')
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
