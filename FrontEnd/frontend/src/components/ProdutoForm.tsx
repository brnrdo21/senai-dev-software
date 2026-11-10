import { useState, type FormEvent } from 'react'
import { produtoService } from '../services/ProdutoService'

interface Props {
  onProdutoCriado: () => void
}

function ProdutoForm({ onProdutoCriado }: Props) {
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [estoque, setEstoque] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)

    try {
      setLoading(true)

      await produtoService.criar({
        nome: nome.trim(),
        preco: Number(preco),
        estoque: Number(estoque),
        ativo,
      })

      setNome('')
      setPreco('')
      setEstoque('')
      setAtivo(true)
      onProdutoCriado()
    } catch {
      setErro('Erro ao cadastrar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Cadastrar Produto</h2>
        <p>Adicione um novo produto ao estoque</p>
      </div>

      {erro && <div className="form-error">{erro}</div>}

      <div className="form-group">
        <label htmlFor="produto-nome">Nome do produto</label>
        <input
          id="produto-nome"
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Digite o nome do produto"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="produto-preco">Preço</label>
          <input
            id="produto-preco"
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="produto-estoque">Estoque</label>
          <input
            id="produto-estoque"
            type="number"
            min="0"
            step="1"
            value={estoque}
            onChange={e => setEstoque(e.target.value)}
            placeholder="0"
            required
          />
        </div>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={ativo}
          onChange={e => setAtivo(e.target.checked)}
        />
        <span>Produto ativo</span>
      </label>

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Confirmar cadastro'}
      </button>
    </form>
  )
}

export default ProdutoForm