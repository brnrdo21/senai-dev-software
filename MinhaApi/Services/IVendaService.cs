using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IVendaService {
    IEnumerable<Venda> GetAll();
    Venda Add(Venda venda);
    Venda? GetById(int id); 
}