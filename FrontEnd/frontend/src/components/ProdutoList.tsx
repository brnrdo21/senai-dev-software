
import type { Produto } from '../types/Produto'

interface Props {
  produtos: Produto[]
  loading: boolean
}

function ProdutoList({ produtos, loading }: Props) {

  if (loading) {
    return (
      <div className="list-status">
        Carregando produtos...
      </div>
    )
  }

  const listaProdutos = Array.isArray(produtos)
    ? produtos
    : []

  if (listaProdutos.length === 0) {
    return (
      <div className="list-empty">
        <strong>Nenhum produto cadastrado</strong>
        <p>Cadastre seu primeiro produto para começar.</p>
      </div>
    )
  }

  return (
    <ul className="app-list products-list">
      {listaProdutos.map((produto) => (
        <li className="app-list-item product-item" key={produto.id}>

          <div className="product-info">

            <div className="product-top">
              <strong className="product-name">
                {produto.nome}
              </strong>

              <span
                className={`list-badge ${
                  produto.ativo ? 'active' : 'inactive'
                }`}
              >
                {produto.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <strong className="product-price">
              {Number(produto.preco).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </strong>

            <div className="product-stock">
              <span>Estoque disponível</span>
              <strong>{produto.estoque} unidades</strong>
            </div>

          </div>

        </li>
      ))}
    </ul>
  )
}

export default ProdutoList
