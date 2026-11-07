import api from './api'
import type { Cliente, NovoCliente } from '../types/Cliente'

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/Cliente')
    return data
  },

  criar: async (cliente: NovoCliente): Promise<Cliente> => {
    const { data } = await api.post('/Cliente', cliente)
    return data
  }
}