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

  realizarVenda: async (
    venda: NovaVenda
  ): Promise<Venda> => {
    const { data } = await api.post<Venda>(
      '/venda',
      venda
    )

    return data
  },
}