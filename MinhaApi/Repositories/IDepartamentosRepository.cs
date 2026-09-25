using MinhaApi.Models;

namespace MinhaApi.Repository;

public interface IDepartamentosRepository {
    IEnumerable<Departamentos> GetAll();
    Departamentos? GetById(int id);
    void Add(Departamentos departamentos);
    void Update(Departamentos departamentos);
    void Delete(int id);
}