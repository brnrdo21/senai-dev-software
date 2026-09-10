using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService {
    Venda? GetById(int id);
    Venda? Update(int id, Venda venda);
    bool Delete(int id);
}