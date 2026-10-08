import { useEffect, useState } from 'react'

import type { Produto } from '../types/Produto'
import { produtoService } from '../services/ProdutoService'

import ProdutoForm from '../components/ProdutoForm'
import ProdutoList from '../components/ProdutoList'
import { PackageIcon } from '../components/Icon'

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
        <h1>Gestão de Produtos</h1>

        <p>
          Cadastre e acompanhe seus produtos.
        </p>
      </header>

      <div className="content-grid">

        {/* FORMULÁRIO */}
        <section className="card">

          <ProdutoForm
            onProdutoCriado={carregarProdutos}
          />

        </section>

        {/* LISTA */}
       <section className="card">

  <div className="card-heading">

    <div>
      <h2>Produtos cadastrados</h2>

      <p>
        Lista de produtos
      </p>
    </div>

    <div className="count-badge">
      {produtos.length}
    </div>

  </div>

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