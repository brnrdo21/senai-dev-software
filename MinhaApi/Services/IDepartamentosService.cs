using MinhaApi.Models;

namespace MinhaApi.Services;

public interface IDepartamentosService {
    IEnumerable<Departamentos> GetAll();
    Departamentos? GetById(int id);
    Departamentos Create(Departamentos departamentos);
    Departamentos? Update(int id, Departamentos departamentos);
    bool Delete(int id);
}