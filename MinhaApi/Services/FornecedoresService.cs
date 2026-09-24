using MinhaApi.Models;
using MinhaApi.Repository;
using MinhaApi.Services;

public class FornecedoresService : IFornecedoresService {
    private readonly IFornecedoresRepository _repo;

    public FornecedoresService(IFornecedoresRepository repo) 
    => _repo = repo;

    public IEnumerable<Fornecedores> GetAll()
    => _repo.GetAll();

    public Fornecedores? GetById(int id)
    => _repo.GetById(id);

    public Fornecedores? GetByNome(string nome)
    => _repo.GetByNome(nome);

    public Fornecedores? GetByCnpj(string cnpj)
    => _repo.GetByCnpj(cnpj);

    public Fornecedores Create(Fornecedores fornecedor) {
        _repo.Add(fornecedor);
        return fornecedor;
    }
    public Fornecedores Update(int id, Fornecedores f) {
        if(_repo.GetById(id) == null) return null;
        f.Id = id;
        _repo.Update(f);
        return f;
    }
    public bool Delete(int id) {
        if(_repo.GetById(id) != null) {
           _repo.Delete(id);
           return true;
        }
        return false;
        }
}