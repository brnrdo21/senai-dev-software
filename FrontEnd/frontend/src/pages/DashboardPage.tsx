
import { useEffect, useState } from 'react'
import { dashboardService } from '../services/DashboardService'

import type {
  DashboardResumo,
  VendasPorDia,
  TopProduto,
  UltimaVenda,
  ProdutoEstoqueBaixo
} from '../types/Dashboard'

import { formatarMoeda } from '../utils/Formatadores'

import CardResumo from '../components/Dashboard/CardResumo'
import GraficoVendas from '../components/Dashboard/GraficoVendas'
import TopProdutos from '../components/Dashboard/TopProdutos'
import UltimasVendas from '../components/Dashboard/UltimasVendas'
import EstoqueBaixo from '../components/Dashboard/EstoqueBaixo'

function DashboardPage() {
  const [dias, setDias] = useState(30)

  const [resumo, setResumo] = useState<DashboardResumo | null>(null)
  const [vendasDia, setVendasDia] = useState<VendasPorDia[]>([])
  const [top, setTop] = useState<TopProduto[]>([])
  const [ultimas, setUltimas] = useState<UltimaVenda[]>([])
  const [estoque, setEstoque] = useState<ProdutoEstoqueBaixo[]>([])

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        setErro(null)

        const [r, v, t, u, e] = await Promise.all([
          dashboardService.resumo(dias),
          dashboardService.vendasPorDia(dias),
          dashboardService.topProdutos(dias, 5),
          dashboardService.ultimasVendas(5),
          dashboardService.estoqueBaixo(5)
        ])

        setResumo(r)
        setVendasDia(v)
        setTop(t)
        setUltimas(u)
        setEstoque(e)

      } catch {
        setErro('Erro ao carregar o dashboard.')
      } finally {
        setLoading(false)
      }
    }

    carregar()
  }, [dias])

  return (
    <div className="dashboard-page">

      {/* CABEÇALHO */}
      <header className="dashboard-header">
        <div>
          <h1>📊 Dashboard</h1>
          <p>Visão geral do seu sistema de gestão</p>
        </div>

        <select
          className="dashboard-periodo"
          value={dias}
          onChange={e => setDias(Number(e.target.value))}
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
        </select>
      </header>

      {/* ERRO */}
      {erro && (
        <div className="dashboard-erro">
          {erro}
        </div>
      )}

      {/* CARREGAMENTO */}
      {loading && (
        <p className="dashboard-loading">
          Carregando dashboard...
        </p>
      )}

      {resumo && (
        <>
          {/* CARDS DE RESUMO */}
          <section className="dashboard-resumo">

            <div className="dashboard-card">
              <CardResumo
                icone="💰"
                titulo="Faturamento"
                destaque
                valor={formatarMoeda(resumo.faturamento)}
              />
            </div>

            <div className="dashboard-card">
              <CardResumo
                icone="🛒"
                titulo="Vendas"
                valor={String(resumo.totalVendas)}
              />
            </div>

            <div className="dashboard-card">
              <CardResumo
                icone="🎯"
                titulo="Ticket médio"
                valor={formatarMoeda(resumo.ticketMedio)}
              />
            </div>

            <div className="dashboard-card">
              <CardResumo
                icone="👤"
                titulo="Clientes ativos"
                valor={String(resumo.totalClientes)}
              />
            </div>

          </section>

          {/* GRÁFICOS */}
          <section className="dashboard-graficos">

            <div className="dashboard-grafico">
              <GraficoVendas dados={vendasDia} />
            </div>

            <div className="dashboard-grafico">
              <TopProdutos dados={top} />
            </div>

          </section>

          {/* INFORMAÇÕES INFERIORES */}
          <section className="dashboard-inferior">

            <div className="dashboard-lista">
              <UltimasVendas dados={ultimas} />
            </div>

            <div className="dashboard-lista">
              <EstoqueBaixo dados={estoque} />
            </div>

          </section>
        </>
      )}

    </div>
  )
}

export default DashboardPage
