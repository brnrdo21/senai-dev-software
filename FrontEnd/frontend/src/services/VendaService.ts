import api from './api'
import type { Venda } from '../types/Venda'

export interface NovaVenda {
  clienteId: number
  produtoId: number
  quantidade: number
}

export const vendaService = {
 listar: async (): Promise<Venda[]> => {
  const { data } = await api.get('/api/Venda')

  const lista = Array.isArray(data)
    ? data
    : Array.isArray(data?.$values)
      ? data.$values
      : null

  if (!lista) {
    console.error('Resposta inválida de vendas:', data)
    throw new Error('Formato inválido na lista de vendas.')
  }

  return lista.map((item: any) => ({
    id: item.id ?? item.Id,
    clienteId:
      item.clienteId ?? item.ClienteId ?? item.cliente_id,
    produtoId:
      item.produtoId ?? item.ProdutoId ?? item.produto_id,
    valor_total:
      Number(
        item.valor_total ??
        item.valorTotal ??
        item.ValorTotal ??
        item.valor ??
        item.Valor ??
        0
      ),
    quantidade: Number(
      item.quantidade ?? item.Quantidade ?? 0
    ),
    data_venda:
      item.data_venda ??
      item.dataVenda ??
      item.DataVenda ??
      item.data ??
      item.Data
  }))
},

  realizarVenda: async (venda: NovaVenda): Promise<Venda> => {
    const { data } = await api.post('/api/Venda', venda)
    return data
  }
}