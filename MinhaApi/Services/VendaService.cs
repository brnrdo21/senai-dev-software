using MinhaApi.Models;
using MinhaApi.Repository;
using MinhaApi.Services;

public class VendaService : IVendaService {
    private readonly IVendaRepository _repo;
    private readonly IClienteRepository _clienterepo;
    private readonly IProdutoRepository _produtorepo;

    public VendaService(IVendaRepository repo, IClienteRepository clienterepo, IProdutoRepository produtorepo) {
        _repo = repo;
        _clienterepo = clienterepo;
        _produtorepo = produtorepo;
    }

    public Venda Add(Venda venda){
        var produto = _produtorepo.GetById(venda.Produto_id);
        if(produto == null) 
        throw new ArgumentException("Produto não encontrado");

        if(venda.Quantidade <= 0)
        throw new ArgumentException("Quantidade insuficiente");

        if(produto.Estoque < venda.Quantidade)
        throw new ArgumentException("Quantidade insuficiente");

        if(venda.Cliente_id <= 0)
        throw new ArgumentException("Cliente inválido");
        return _repo.Add(venda);
    }
    public int calcularValorTotal(Venda venda) {
        var produto = _produtorepo.GetById(venda.Produto_id);
        if(produto == null) 
        throw new ArgumentException("Produto não encontrado");
        var valorTotal = produto.Preco * venda.Quantidade;
        return (int)valorTotal;
    }
}