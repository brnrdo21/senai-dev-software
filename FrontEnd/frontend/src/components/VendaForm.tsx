import { useEffect, useState } from 'react'

import { clienteService } from '../services/ClienteService'
import { produtoService } from '../services/ProdutoService'
import { vendaService } from '../services/VendaService'

import type { Cliente } from '../types/Cliente'
import type { Produto } from '../types/Produto'
import type { Venda } from '../types/Venda'

interface Props {
  onVendaCriada: () => void
}

function VendaForm({ onVendaCriada }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  const [clienteId, setClienteId] = useState('')
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState('1')

  const [carregando, setCarregando] = useState(false)
  const [carregandoListas, setCarregandoListas] = useState(true)

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    const carregarListas = async () => {
      try {
        setCarregandoListas(true)

        const [listaClientes, listaProdutos] =
          await Promise.all([
            clienteService.listar(),
            produtoService.listar()
          ])

        setClientes(listaClientes)
        setProdutos(listaProdutos)
      } catch (error) {
        console.error('Erro ao carregar listas:', error)
        setErro('Não foi possível carregar clientes e produtos.')
      } finally {
        setCarregandoListas(false)
      }
    }

    carregarListas()
  }, [])

  const realizarVenda = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setErro('')
    setSucesso('')

    const idCliente = Number(clienteId)
    const idProduto = Number(produtoId)
    const qtd = Number(quantidade)

    if (!idCliente || !idProduto || qtd <= 0 || !Number.isInteger(qtd)) {
      setErro('Selecione um cliente, um produto e uma quantidade inteira válida.')
      return
    }

    try {
      setCarregando(true)

      const venda: Omit<Venda, 'id' | 'valor_total' | 'data_venda'> = {
        clienteId: idCliente,
        produtoId: idProduto,
        quantidade: qtd
      }

      const resposta = await vendaService.realizarVenda(venda)

      setSucesso(
        `Venda realizada com sucesso! Valor total: ${Number(
          resposta.valor_total
        ).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })}`
      )

      setClienteId('')
      setProdutoId('')
      setQuantidade('1')

      onVendaCriada()
    } catch (error: any) {
      console.error('Erro ao realizar venda:', error)

      setErro(
        error?.response?.data?.message ||
        error?.response?.data?.mensagem ||
        error?.response?.data?.title ||
        'Não foi possível realizar a venda. Verifique os dados e tente novamente.'
      )
    } finally {
      setCarregando(false)
    }
  }

  return (
    <form className="app-form" onSubmit={realizarVenda}>
      <h2>Registrar venda</h2>

      {erro && (
        <div className="form-error" role="alert">
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="form-success" role="status">
          {sucesso}
        </div>
      )}

      {carregandoListas ? (
        <p className="list-status">
          Carregando clientes e produtos...
        </p>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="clienteId">Cliente</label>

            <select
              id="clienteId"
              value={clienteId}
              onChange={(event) => setClienteId(event.target.value)}
              required
              disabled={carregando}
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
              onChange={(event) => setProdutoId(event.target.value)}
              required
              disabled={carregando}
            >
              <option value="">Selecione um produto</option>

              {produtos.map((produto) => (
                <option
                  key={produto.id}
                  value={produto.id}
                  disabled={produto.ativo === false}
                >
                  {produto.nome} — R${' '}
                  {Number(produto.preco).toFixed(2)}
                  {produto.ativo === false ? ' (Inativo)' : ''}
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
              onChange={(event) => setQuantidade(event.target.value)}
              required
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            disabled={carregando || clientes.length === 0 || produtos.length === 0}
          >
            {carregando ? 'Registrando venda...' : 'Realizar venda'}
          </button>
        </>
      )}
    </form>
  )
}

export default VendaForm