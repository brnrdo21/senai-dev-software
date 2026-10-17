import api from './api'
import type { Cliente, NovoCliente } from '../types/Cliente'

export const clienteService = {
  listar: async (): Promise<Cliente[]> => {
    const { data } = await api.get('/api/Cliente')
    return data
  },

  criar: async (cliente: NovoCliente): Promise<Cliente> => {
    const { data } = await api.post('/api/Cliente', cliente)
    return data
  }
}