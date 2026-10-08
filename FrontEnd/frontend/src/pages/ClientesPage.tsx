import { useEffect, useState } from 'react'

import type { Cliente } from '../types/Cliente'
import { clienteService } from '../services/ClienteService'

import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'
import { UsersIcon } from '../components/Icon'

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)

  const carregarClientes = async () => {
    setLoading(true)

    try {
      const dados = await clienteService.listar()
      setClientes(dados)
    } catch {
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  return (
    <div className="page">

      <header className="page-header">
        <h1>Gestão de Clientes</h1>

        <p>
          Cadastre e visualize os clientes do sistema.
        </p>
      </header>

      <div className="content-grid">

        {/* FORMULÁRIO */}
        <section className="card">

          <ClienteForm
            onClienteCriado={carregarClientes}
          />

        </section>

        {/* LISTA */}
        <section className="card">

          <div className="card-heading">

            <div className="card-heading-left">

              <div className="card-heading-icon cliente-heading-icon">
                <UsersIcon size={19} />
              </div>

              <div>
                <h2>Clientes cadastrados</h2>

                <p>
                  Lista de clientes
                </p>
              </div>

            </div>

            <div className="count-badge">
              {clientes.length}
            </div>

          </div>

          <ClienteList
            clientes={clientes}
            loading={loading}
          />

        </section>

      </div>

    </div>
  )
}

export default ClientesPage