
import { useEffect, useState } from 'react'

import type { Produto } from '../types/Produto'
import { produtoService } from '../services/ProdutoService'

import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)

  const carregarProdutos = async () => {
    setLoading(true)

    try {
      const dados = await produtoService.listar()
      setProdutos(dados)
    } catch {
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  return (
    <div className="page">

      <header className="page-header">
        <div>
          <h1>Gestão de Produtos</h1>
          <p>Cadastre, organize e acompanhe seus produtos.</p>
        </div>
      </header>

      <div className="content-grid">

        {/* FORMULÁRIO */}
        <section className="card">
          <ProdutoForm
            onProdutoCriado={carregarProdutos}
          />
        </section>

        {/* LISTAGEM */}
        <section className="card products-list-card">

          <div className="products-card-header">

            <div className="products-heading">
              <div className="products-icon">
                📦
              </div>

              <div>
                <h2>Produtos cadastrados</h2>
                <p>Gerencie todos os produtos do estoque</p>
              </div>
            </div>

            <div className="products-count">
              <span>{produtos.length}</span>
              <small>Produtos</small>
            </div>

          </div>

          <div className="products-divider"></div>

          <ProdutoList
            produtos={produtos}
            loading={loading}
          />

        </section>

      </div>

    </div>
  )
}

export default ProdutosPage
