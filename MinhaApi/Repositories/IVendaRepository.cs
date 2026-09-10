using MinhaApi.Models;

namespace MinhaApi.Repository;

public interface IVendaRepository {
    Venda? GetById(int id);
    void Add(Venda venda);
    void Update(Venda venda);
    void Delete(int id);
}