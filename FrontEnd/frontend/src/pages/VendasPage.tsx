import { useEffect, useState } from 'react'

import type { Venda } from '../types/Venda'
import { vendaService } from '../services/VendaService'

import VendaForm from '../components/VendaForm'
import VendaList from '../components/VendaList'
import { UsersIcon } from '../components/Icon'

function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(false)

  const carregarVendas = async () => {
    setLoading(true)

    try {
      const dados = await vendaService.listar()
      setVendas(dados)
    } catch {
      setVendas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarVendas()
  }, [])

  return (
    <div className="page">

      <header className="page-header">
        <h1>Gestão de Vendas</h1>

        <p>
          Cadastre e visualize as vendas do sistema.
        </p>
      </header>

      <div className="content-grid">

        {/* FORMULÁRIO */}
        <section className="card">

          <VendaForm
            onVendaCriada={carregarVendas}
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
                <h2>Vendas cadastradas</h2>

                <p>
                  Lista de vendas
                </p>
              </div>

            </div>

            <div className="count-badge">
              {vendas.length}
            </div>

          </div>

          <VendaList
            vendas={vendas}
            loading={loading}
          />

        </section>

      </div>

    </div>
  )
}

export default VendasPage