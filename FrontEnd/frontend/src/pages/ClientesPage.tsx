import { useEffect, useState } from 'react'
import  type { Cliente } from '../types/Cliente'
import { clienteService } from '../services/ClienteService'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)

  const carregarClientes = async () => {
    setLoading(true)
    try { setClientes(await clienteService.listar()) }
    finally { setLoading(false) }
  }

  useEffect(() => { carregarClientes() }, [])
  return (<div>
    <h1>Gestão de Clientes</h1>
    <ClienteForm onClienteCriado={carregarClientes} />
    <ClienteList clientes={clientes} loading={loading} />
  </div>)
}
export default ClientesPage