import api from './api'

import type {
  Produto,
  NovoProduto
} from '../types/Produto'

export const produtoService = {
  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/api/Produto')

    console.error(
      'Formato inesperado na resposta da API:',
      data
    )
    return []
  },

  criar: async (
    produto: NovoProduto
  ): Promise<Produto> => {
    const { data } = await api.post('/produto', produto)
    return data
  }

}