// Os nomes devem coincidir com o Swagger
export interface Venda {
  id: number
  clienteId: number
  produtoId: number
  valor_total: number
  quantidade: number
  data_venda: Date
}

export type NovaVenda = Omit<Venda,'clienteId' | 'produtoId' | 'qauntidade'
>