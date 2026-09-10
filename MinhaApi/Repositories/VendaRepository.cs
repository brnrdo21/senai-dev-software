using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class VendaRepository : IVendaRepository {
    private readonly string _connectionString;

    public VendaRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;
public Venda? GetById(int id) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    const string sql = @"
        SELECT id, cliente_id, produto_id, valor, data_venda, ativo
        FROM venda
        WHERE id = @Id";

    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);

    using var reader = cmd.ExecuteReader();

    if (!reader.Read())
        return null;

    return new Venda
    {
        Id = reader.GetInt32("id"),
        Cliente_id = reader.GetInt32("cliente_id"),
        Produto_id = reader.GetInt32("produto_id"),
        Valor = reader.GetDecimal("valor"),
        Data_venda = reader.GetDateTime("data_venda"),
        Ativo = reader.GetBoolean("ativo")
    };
}

    public void Add(Venda v) {
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
}
    public void Update(Venda v) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = @"UPDATE venda 
                   SET nome = @Nome, preco = @Preco, estoque = @Estoque, ativo = @Ativo 
                   WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", v.Id);
    cmd.Parameters.AddWithValue("@ClienteId", v.Cliente_id);
    cmd.Parameters.AddWithValue("@ProdutoId", v.Produto_id);
    cmd.Parameters.AddWithValue("@Valor", v.Valor);
    cmd.Parameters.AddWithValue("@DataVenda", v.Data_venda);
    cmd.Parameters.AddWithValue("@Ativo", v.Ativo);
    cmd.ExecuteNonQuery();
}

public void Delete(int id) {
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();
    string sql = "DELETE FROM venda WHERE id = @Id";
    using var cmd = new MySqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Id", id);
    cmd.ExecuteNonQuery();
}
}