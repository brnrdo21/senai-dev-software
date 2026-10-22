import api from './api'
import type { Produto, NovoProduto } from '../types/Produto'

export const produtoService = {
  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/api/Produto')

    if (Array.isArray(data)) {
      return data
    }

    // Algumas APIs retornam a lista dentro de uma propriedade.
    if (Array.isArray(data?.$values)) {
      return data.$values
    }

    console.error('Resposta inválida ao listar produtos:', data)
    throw new Error('A API não retornou uma lista válida de produtos.')
  },

  criar: async (produto: NovoProduto): Promise<Produto> => {
    const { data } = await api.post('/api/Produto', produto)
    return data
  }
}