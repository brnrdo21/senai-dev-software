using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class DepartamentosRepository : IDepartamentosRepository {
    private readonly string _connectionString;

    public DepartamentosRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

     public IEnumerable<Departamentos> GetAll() {
      var lista = new List<Departamentos>();
      using var conn = new MySqlConnection(_connectionString);
      conn.Open();

      string sql = "SELECT id, nome, descricao, id_fornecedorD, ativo FROM departamentos";
      using var cmd = new MySqlCommand(sql, conn);
      using var reader = cmd.ExecuteReader();

      while (reader.Read()) {
          lista.Add(new Departamentos {
              Id = reader.GetInt32("id"),
              Nome = reader.GetString("nome"),
              Descricao = reader.GetString("descricao"),
              Id_fornecedorD = reader.GetInt32("id_fornecedorD"),
              Ativo = reader.GetBoolean("ativo")
          });
      }
      return lista;
  }

   public Departamentos? GetById(int id)
{
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = "SELECT id, nome, descricao, id_fornecedorD, ativo FROM departamentos WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);

    using var reader = cmd.ExecuteReader();
    if (reader.Read()) {
        return new Departamentos {
            Id = reader.GetInt32("id"),
            Nome = reader.GetString("nome"),
            Descricao = reader.GetString("descricao"),
            Id_fornecedorD = reader.GetInt32("id_fornecedorD"),
            Ativo = reader.GetBoolean("ativo")
        };
    }
    return null;
}

    public void Add(Departamentos d) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = @"INSERT INTO departamentos (nome, descricao, id_fornecedorD, ativo) 
                   VALUES (@Nome, @Descricao, @Id_fornecedorD, @Ativo);
                   SELECT LAST_INSERT_ID();";

    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Nome", d.Nome);
    cmd.Parameters.AddWithValue("@Descricao", d.Descricao);
    cmd.Parameters.AddWithValue("@id_fornecedorD", d.Id_fornecedorD);
    cmd.Parameters.AddWithValue("@Ativo", d.Ativo);

    // Executa a inserção e recupera o ID gerado pelo MySQL
    var idGerado = cmd.ExecuteScalar();
    d.Id = Convert.ToInt32(idGerado);
}
    public void Update(Departamentos d) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = @"UPDATE departamentos 
                   SET nome = @Nome, descricao = @Descricao, id_fornecedorD = @Id_fornecedorD, ativo = @Ativo 
                   WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", d.Id);
    cmd.Parameters.AddWithValue("@Nome", d.Nome);
    cmd.Parameters.AddWithValue("@Descricao", d.Descricao);
    cmd.Parameters.AddWithValue("@id_fornecedorD", d.Id_fornecedorD);
    cmd.Parameters.AddWithValue("@Ativo", d.Ativo);
    cmd.ExecuteNonQuery();
}

public void Delete(int id) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = "DELETE FROM departamentos WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);
    cmd.ExecuteNonQuery();
}
}