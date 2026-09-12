using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class VendaRepository : IVendaRepository {
    private readonly string _connectionString;

    public VendaRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

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
}