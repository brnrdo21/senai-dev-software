
using MinhaApi.Models;
using MinhaApi.Repository;
using MinhaApi.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _repo;

    public ProdutoService(IProdutoRepository repo)
        => _repo = repo;

    public IEnumerable<Produto> GetAll()
        => _repo.GetAll();

    public Produto? GetById(int id)
        => _repo.GetById(id);

    public Produto Create(Produto produto)
    {
        if (produto.Preco < 0)
            throw new ArgumentException("Preço inválido");

        if (produto.Estoque < 0)
            throw new ArgumentException("Estoque inválido");

        _repo.Add(produto);

        return produto;
    }

    public Produto? Update(int id, Produto p)
    {
        var existente = _repo.GetById(id);

        if (existente == null)
            return null;

        if (p.Preco < 0)
            throw new ArgumentException("Preço inválido");

        if (p.Estoque < 0)
            throw new ArgumentException("Estoque inválido");

        p.Id = id;

        // Mantém a foto antiga caso nenhuma nova seja enviada
        if (string.IsNullOrWhiteSpace(p.Foto))
            p.Foto = existente.Foto;

        _repo.Update(p);

        return p;
    }

    public bool Delete(int id)
    {
        if (_repo.GetById(id) != null)
        {
            _repo.Delete(id);
            return true;
        }

        return false;
    }
}
