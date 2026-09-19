using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class VendaRepository : IVendaRepository {
    private readonly string _connectionString;

    public VendaRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

    public Venda Add(Venda v) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    string sql = @"INSERT INTO venda (cliente_id, produto_id, valor, data_venda, ativo) 
                   VALUES (@ClienteId, @ProdutoId, @Valor, @DataVenda, @Ativo);
                   SELECT LAST_INSERT_ID();";

    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@ClienteId", v.Cliente_id);
    cmd.Parameters.AddWithValue("@ProdutoId", v.Produto_id);
    cmd.Parameters.AddWithValue("@Valor", v.Valor);
    cmd.Parameters.AddWithValue("@DataVenda", v.Data_venda);
    cmd.Parameters.AddWithValue("@Ativo", v.Ativo);

    // Executa a inserção e recupera o ID gerado pelo MySQL
    var idGerado = cmd.ExecuteScalar();
    v.Id = Convert.ToInt32(idGerado);
    return v;
}
public IEnumerable<Venda> GetAll() {
      var lista = new List<Venda>();
      using var conn = new MySqlConnection(_connectionString);
      conn.Open();

      string sql = "SELECT id, cliente_id, produto_id, valor, data_venda, ativo FROM venda";
      using var cmd = new MySqlCommand(sql, conn);
      using var reader = cmd.ExecuteReader();

      while (reader.Read()) {
          lista.Add(new Venda {
              Id = reader.GetInt32("id"),
              Cliente_id = reader.GetInt32("cliente_id"),
              Produto_id = reader.GetInt32("produto_id"),
              Valor = reader.GetDecimal("valor"),
              Data_venda = reader.GetDateTime("data_venda"),
              Ativo = reader.GetBoolean("ativo")
          });
      }
      return lista;
  }

    public Venda? GetById(int id)
    {
      using var conn = new MySqlConnection(_connectionString);
      conn.Open();

      const string sql = @"SELECT cliente_id, produto_id, cliente.nome AS Cliente, produtos.nome AS Produto, venda.valor, data_venda, venda.ativo
                           FROM venda
                           JOIN cliente ON cliente.id = venda.cliente_id
                           JOIN produtos ON produtos.id = venda.produto_id";
      using var cmd = new MySqlCommand(sql, conn);
      cmd.Parameters.AddWithValue("@Id", id);

      using var reader = cmd.ExecuteReader();
      if (!reader.Read())
          return null;

      return new Venda
      {
          Cliente_id = reader.GetInt32("cliente_id"),
          Produto_id = reader.GetInt32("produto_id"),
          Valor = reader.GetDecimal("valor"),
          Data_venda = reader.GetDateTime("data_venda"),
          Ativo = reader.GetBoolean("ativo")
      };
    }
}