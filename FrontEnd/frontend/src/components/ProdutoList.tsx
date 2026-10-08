import type { Produto } from '../types/Produto'
import { PackageIcon } from './Icon'

interface Props {
  produtos: Produto[]
  loading: boolean
}

function ProdutoList({
  produtos,
  loading
}: Props) {

  if (loading) {
    return (
      <div className="list-status">
        Carregando produtos...
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <div className="list-empty">

        <div className="empty-icon">
          <PackageIcon size={30} />
        </div>

        <strong>
          Nenhum produto cadastrado
        </strong>

        <p>
          Cadastre seu primeiro produto.
        </p>

      </div>
    )
  }

  return (
    <ul className="app-list">

      {produtos.map(produto => (

        <li
          className="app-list-item"
          key={produto.id}
        >

          <div className="list-avatar produto-avatar">
            <PackageIcon size={19} />
            </div>

          <div className="list-info">

            <strong>
              {produto.nome}
            </strong>

            <span className="product-price">
              R$ {produto.preco.toFixed(2)}
            </span>

            <small>
              Estoque: {produto.estoque}
            </small>

          </div>

          <span
            className={`list-badge ${
              produto.ativo
                ? 'active'
                : 'inactive'
            }`}
          >
            {produto.ativo
              ? 'Ativo'
              : 'Inativo'}
          </span>

        </li>

      ))}

    </ul>
  )
}

export default ProdutoList