import api from './api'

import type {
  Venda,
  NovaVenda
} from '../types/Venda'

export const vendaService = {

  listar: async (): Promise<Venda[]> => {
    const { data } = await api.get('/venda')
    return data
  },

 realizarVenda: async (venda: {
  clienteId: number
  produtoId: number
  quantidade: number
}): Promise<Venda> => {
  const { data } = await api.post('/venda', venda)
  return data
},
}