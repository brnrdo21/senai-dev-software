import api from './api'

import type {
  Cliente,
  NovoCliente
} from '../types/Cliente'

export const clienteService = {

  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/cliente')

    // Caso a API retorne um array diretamente
    if (Array.isArray(data)) {
      return data
    }

    // Caso a API retorne { clientes: [...] }
    if (Array.isArray(data?.clientes)) {
      return data.clientes
    }

    // Caso a API retorne { data: [...] }
    if (Array.isArray(data?.data)) {
      return data.data
    }

    console.error(
      'A API retornou um formato inesperado:',
      data
    )

    return []
  },

  criar: async (
    cliente: NovoCliente
  ): Promise<Cliente> => {
    const { data } = await api.post(
      '/cliente',
      cliente
    )

    return data
  }

}