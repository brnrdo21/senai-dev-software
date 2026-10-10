import api from './api'

import type {
  Produto,
  NovoProduto
} from '../types/Produto'

export const produtoService = {

  listar: async (): Promise<Produto[]> => {

    const { data } =
      await api.get('/produto')

    return data
  },

  criar: async ( produto: NovoProduto ): Promise<Produto> => {

    const { data } =
      await api.post(
        '/produto',
        produto
      )

    return data
  }

}