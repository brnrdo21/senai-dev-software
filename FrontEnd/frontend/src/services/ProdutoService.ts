
import api from './api'
import type { Produto, NovoProduto } from '../types/Produto'

export const produtoService = {
  listar: async (): Promise<Produto[]> => {
    const { data } = await api.get('/Produto')

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data?.$values)) {
      return data.$values
    }

    console.error('Resposta inválida ao listar produtos:', data)
    throw new Error('A API não retornou uma lista válida de produtos.')
  },

  criar: async (produto: NovoProduto): Promise<Produto> => {
    const { data } = await api.post('/Produto', produto)
    return data
  },

  enviarFoto: async (id: number, foto: File): Promise<Produto> => {
    const formData = new FormData()
    formData.append('foto', foto)

    const { data } = await api.post(
      `/Produto/${id}/foto`,
      formData
    )

    return data
  }
}
