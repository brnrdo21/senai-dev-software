
import { useEffect, useMemo, useState } from 'react'
import { clienteService } from '../services/ClienteService'
import { produtoService } from '../services/ProdutoService'
import { vendaService } from '../services/VendaService'
import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'

interface Props {
  onVendaCriada: () => void
}

function VendaForm({ onVendaCriada }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clienteId, setClienteId] = useState('')
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [listaClientes, listaProdutos] = await Promise.all([
          clienteService.listar(),
          produtoService.listar()
        ])

        setClientes(Array.isArray(listaClientes) ? listaClientes : [])
        setProdutos(Array.isArray(listaProdutos) ? listaProdutos : [])
      } catch {
        setErro('Não foi possível carregar clientes e produtos.')
      }
    }

    carregarOpcoes()
  }, [])

  const produtoSelecionado = produtos.find(
    produto => String(produto.id) === produtoId
  )

  const total = useMemo(() => {
    return (produtoSelecionado?.preco ?? 0) * Number(quantidade || 0)
  }, [produtoSelecionado, quantidade])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!clienteId || !produtoId) {
      setErro('Selecione um cliente e um produto.')
      return
    }

    const qtd = Number(quantidade)

    if (!Number.isInteger(qtd) || qtd < 1) {
      setErro('Informe uma quantidade inteira maior que zero.')
      return
    }

    setLoading(true)

    try {
      await vendaService.realizarVenda({
        clienteId: Number(clienteId),
        produtoId: Number(produtoId),
        quantidade: qtd
      })

      setSucesso('Venda registrada com sucesso!')
      setClienteId('')
      setProdutoId('')
      setQuantidade('1')
      onVendaCriada()
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        'Não foi possível registrar a venda. Verifique os dados e o estoque.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="sales-card">
      <div className="sales-card-header">
        <div>
          <span className="sales-eyebrow">OPERAÇÃO</span>
          <h2>Registrar venda</h2>
          <p>Preencha os dados para realizar uma nova venda.</p>
        </div>
      </div>

      <form className="sales-form" onSubmit={handleSubmit}>
        <div className="sales-field">
          <label htmlFor="venda-cliente">Cliente</label>
          <select
            id="venda-cliente"
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="sales-field">
          <label htmlFor="venda-produto">Produto</label>
          <select
            id="venda-produto"
            value={produtoId}
            onChange={e => setProdutoId(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — {Number(produto.preco).toLocaleString(
                  'pt-BR',
                  { style: 'currency', currency: 'BRL' }
                )}
              </option>
            ))}
          </select>
        </div>

        <div className="sales-field">
          <label htmlFor="venda-quantidade">Quantidade</label>
          <input
            id="venda-quantidade"
            type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={e => setQuantidade(e.target.value)}
            required
          />
        </div>
        
 
        <div className="sales-total">
          <div className="sales-total-info">
            <span>Valor total da venda</span>

            <small>
              {produtoSelecionado
                ? `${Number(quantidade) || 0} unidade(s) de ${produtoSelecionado.nome}`
                : 'Selecione um produto para calcular'}
            </small>
          </div>

          <strong>
            {total.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}
          </strong>
        </div>

        {erro && <p className="sales-message sales-error">{erro}</p>}
        {sucesso && (
          <p className="sales-message sales-success">{sucesso}</p>
        )}

        <button className="sales-submit" type="submit" disabled={loading}>
          {loading ? 'Registrando venda...' : 'Confirmar venda'}
        </button>
      </form>
    </section>
  )
}

export default VendaForm
