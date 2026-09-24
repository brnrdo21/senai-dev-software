using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IFornecedoresService {
    IEnumerable<Fornecedores> GetAll();
    Fornecedores? GetById(int id);
    Fornecedores? GetByNome(string nome);
    Fornecedores? GetByCnpj(string cnpj);
    Fornecedores Create(Fornecedores fornecedor);
    Fornecedores? Update(int id, Fornecedores fornecedor);
    bool Delete(int id);
}