import api from './api'

import type {
  Produto,
  NovoProduto
} from '../types/Produto'

export const produtoService = {

  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/produto')

    // Aceita uma lista direta ou uma lista dentro de um objeto
    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.produtos)) {
      return data.produtos
    }

    if (Array.isArray(data?.data)) {
      return data.data
    }

    console.error(
      'Formato inesperado na resposta da API:',
      data
    )

    return []
  },

  criar: async (
    produto: NovoProduto
  ): Promise<Produto> => {
    const { data } = await api.post(
      '/produto',
      produto
    )

    return data
  }

}