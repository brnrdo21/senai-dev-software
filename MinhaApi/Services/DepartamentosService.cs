using MinhaApi.Models;
using MinhaApi.Repository;
using MinhaApi.Services;

public class DepartamentosService : IDepartamentosService {
    private readonly IDepartamentosRepository _repo;

    public DepartamentosService(IDepartamentosRepository repo) 
    => _repo = repo;

    public IEnumerable<Departamentos> GetAll()
    => _repo.GetAll();

    public Departamentos? GetById(int id)
    => _repo.GetById(id);

    public Departamentos Create(Departamentos departamentos) {
        _repo.Add(departamentos);
        return departamentos;
    }
    public Departamentos Update(int id, Departamentos d) {
        if(_repo.GetById(id) == null) return null;
        d.Id = id;
        _repo.Update(d);
        return d;
    }
    public bool Delete(int id) {
        if(_repo.GetById(id) != null) {
           _repo.Delete(id);
           return true;
        }
        return false;
        }
}