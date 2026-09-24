using MinhaApi.Models;

namespace MinhaApi.Repository;

public interface IFornecedoresRepository {
    IEnumerable<Fornecedores> GetAll();
    Fornecedores? GetById(int id);
    Fornecedores? GetByNome(string nome);
    Fornecedores? GetByCnpj(string cnpj);
    void Add(Fornecedores fornecedor);
    void Update(Fornecedores fornecedor);
    void Delete(int id);
}