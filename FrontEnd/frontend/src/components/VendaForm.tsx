import { useEffect, useState } from 'react'

import { clienteService } from '../services/ClienteService'
import { produtoService } from '../services/ProdutoService'
import { vendaService } from '../services/VendaService'

import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'

interface Props {
  onVendaCriada: () => void
}

function VendaForm({ onVendaCriada }: Props) {
  const [clienteId, setClienteId] = useState('')
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  const [carregandoListas, setCarregandoListas] = useState(true)
  const [carregando, setCarregando] = useState(false)

  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  // Carrega clientes e produtos ao montar o componente
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregandoListas(true)

        const [listaClientes, listaProdutos] = await Promise.all([
          clienteService.listar(),
          produtoService.listar(),
        ])

        setClientes(listaClientes)
        setProdutos(listaProdutos)
      } catch (error) {
        console.error(error)
        setErro('Não foi possível carregar clientes e produtos.')
      } finally {
        setCarregandoListas(false)
      }
    }

    carregarDados()
  }, [])

  // Registra uma nova venda
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setErro(null)
    setSucesso(null)

    if (!clienteId || !produtoId) {
      setErro('Selecione um cliente e um produto.')
      return
    }

    const quantidadeNumerica = Number(quantidade)

    if (
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica <= 0
    ) {
      setErro('Informe uma quantidade inteira maior que zero.')
      return
    }

    try {
      setCarregando(true)

      const vendaCriada = await vendaService.realizarVenda({
        clienteId: Number(clienteId),
        produtoId: Number(produtoId),
        quantidade: quantidadeNumerica,
      })

      // Exibe o valor total retornado pela API
      setSucesso(
        `Venda registrada! Total: ${Number(
          vendaCriada.valor_total
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`
      )

      // Limpa os campos
      setClienteId('')
      setProdutoId('')
      setQuantidade('1')

      // Atualiza a lista no componente pai
      onVendaCriada()
    } catch (error: unknown) {
      console.error(error)

      const mensagem =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
            ? error.message
            : 'Não foi possível registrar a venda.'

      setErro(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar venda</h2>

      <div className="form-group">
        <label htmlFor="clienteId">Cliente</label>

        <select
          id="clienteId"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          disabled={carregando || carregandoListas}
          required
        >
          <option value="">Selecione um cliente</option>

          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="produtoId">Produto</label>

        <select
          id="produtoId"
          value={produtoId}
          onChange={(e) => setProdutoId(e.target.value)}
          disabled={carregando || carregandoListas}
          required
        >
          <option value="">Selecione um produto</option>

          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantidade">Quantidade</label>

        <input
          id="quantidade"
          type="number"
          min="1"
          step="1"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          disabled={carregando || carregandoListas}
          required
        />
      </div>

      {erro && (
        <p className="form-error" role="alert">
          {erro}
        </p>
      )}

      {sucesso && (
        <p className="form-success" role="status">
          {sucesso}
        </p>
      )}

      <button
        type="submit"
        disabled={carregando || carregandoListas}
      >
        {carregandoListas
          ? 'Carregando dados...'
          : carregando
            ? 'Registrando venda...'
            : 'Registrar venda'}
      </button>
    </form>
  )
}

export default VendaForm
