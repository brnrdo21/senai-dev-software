using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IClienteService {
    Cliente? GetById(int id);
    Cliente Create(Cliente cliente);
    Cliente? Update(int id, Cliente cliente);
    bool Delete(int id);
    object GetAll();

}