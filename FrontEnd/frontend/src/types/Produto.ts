
export interface Produto {
  id: number
  nome: string
  preco: number
  estoque: number
  ativo: boolean
  foto?: string | null
  fotoBase64?: string | null
}

export type NovoProduto = Omit<Produto, 'id' | 'foto' | 'fotoBase64'>
