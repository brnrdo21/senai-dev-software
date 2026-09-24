using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class FornecedoresRepository : IFornecedoresRepository {
    private readonly string _connectionString;

    public FornecedoresRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

     public IEnumerable<Fornecedores> GetAll() {
      var lista = new List<Fornecedores>();
      using var conn = new MySqlConnection(_connectionString);
      conn.Open();

      string sql = "SELECT id, nome, cnpj, id_produtoF, data_e, ativo FROM fornecedores";
      using var cmd = new MySqlCommand(sql, conn);
      using var reader = cmd.ExecuteReader();

      while (reader.Read()) {
          lista.Add(new Fornecedores {
              Id = reader.GetInt32("id"),
              Nome = reader.GetString("nome"),
              Cnpj = reader.GetString("cnpj"),
              Id_produtosF = reader.GetInt32("id_produtoF"),
              Data_e = reader.GetDateTime("data_e"),
              Ativo = reader.GetBoolean("ativo")
          });
      }
      return lista;
  }

   public Fornecedores? GetById(int id) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = "SELECT id, nome, cnpj, id_produtoF, data_e, ativo FROM fornecedores WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);

    using var reader = cmd.ExecuteReader();
    if (reader.Read()) {
        return new Fornecedores {
            Id = reader.GetInt32("id"),
            Nome = reader.GetString("nome"),
            Cnpj = reader.GetString("cnpj"),
            Id_produtosF = reader.GetInt32("id_produtoF"),
            Data_e = reader.GetDateTime("data_e"),
            Ativo = reader.GetBoolean("ativo")
        };
    }
    return null;
}
   public Fornecedores? GetByNome(string nome) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = "SELECT id, nome, cnpj, id_produtoF, data_e, ativo FROM fornecedores WHERE nome = @Nome";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Nome", nome);

    using var reader = cmd.ExecuteReader();
    if (reader.Read()) {
        return new Fornecedores {
            Id = reader.GetInt32("id"),
            Nome = reader.GetString("nome"),
            Cnpj = reader.GetString("cnpj"),
            Id_produtosF = reader.GetInt32("id_produtoF"),
            Data_e = reader.GetDateTime("data_e"),
            Ativo = reader.GetBoolean("ativo")
        };
    }
    return null;
}
  public Fornecedores? GetByCnpj(string cnpj) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = "SELECT id, nome, cnpj, id_produtoF, data_e, ativo FROM fornecedores WHERE cnpj = @Cnpj";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Cnpj", cnpj);

    using var reader = cmd.ExecuteReader();
    if (reader.Read()) {
        return new Fornecedores {
            Id = reader.GetInt32("id"),
            Nome = reader.GetString("nome"),
            Cnpj = reader.GetString("cnpj"),
            Id_produtosF = reader.GetInt32("id_produtoF"),
            Data_e = reader.GetDateTime("data_e"),
            Ativo = reader.GetBoolean("ativo")
        };
    }
    return null;
}

    public void Add(Fornecedores f) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = @"INSERT INTO fornecedores (nome, cnpj, id_produtoF,data_e, ativo) 
                   VALUES (@Nome, @Cnpj, @id_produtoF, @Data_e, @Ativo);
                   SELECT LAST_INSERT_ID();";

    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Nome", f.Nome);
    cmd.Parameters.AddWithValue("@Cnpj", f.Cnpj);
    cmd.Parameters.AddWithValue("@id_produtoF", f.Id_produtosF);
    cmd.Parameters.AddWithValue("@Data_e", f.Data_e);
    cmd.Parameters.AddWithValue("@Ativo", f.Ativo);

    // Executa a inserção e recupera o ID gerado pelo MySQL
    var idGerado = cmd.ExecuteScalar();
    f.Id = Convert.ToInt32(idGerado);
}
    public void Update(Fornecedores f) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = @"UPDATE fornecedores 
                   SET nome = @Nome, cnpj = @Cnpj, id_produtoF = @id_produtoF, Data_e = @Data_e, ativo = @Ativo 
                   WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", f.Id);
    cmd.Parameters.AddWithValue("@Nome", f.Nome);
    cmd.Parameters.AddWithValue("@Cnpj", f.Cnpj);
    cmd.Parameters.AddWithValue("@id_produtoF", f.Id_produtosF);
    cmd.Parameters.AddWithValue("@Data_e", f.Data_e);
    cmd.Parameters.AddWithValue("@Ativo", f.Ativo);
    cmd.ExecuteNonQuery();
}

public void Delete(int id) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = "DELETE FROM fornecedores WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);
    cmd.ExecuteNonQuery();
}
}