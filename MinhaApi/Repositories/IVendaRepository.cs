using MinhaApi.Models;

namespace MinhaApi.Repository;

public interface IVendaRepository {
    Venda Add(Venda venda);
    IEnumerable<Venda> GetAll();
    Venda? GetById(int id);
}