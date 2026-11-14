using MinhaApi.Models;
using MinhaApi.Repository;
using MySqlConnector;

public class VendaRepository : IVendaRepository {
    private readonly string _connectionString;

    public VendaRepository(IConfiguration config) 
      => _connectionString = config.GetConnectionString("DefaultConnection")!;

    
public Venda Add(Venda v)
{
    using var conn = new MySqlConnection(_connectionString);
    conn.Open();

    using var transaction = conn.BeginTransaction();

    try
    {
        // Atualiza o estoque somente se houver quantidade suficiente
        string sqlEstoque = @"
            UPDATE produtos
            SET estoque = estoque - @Quantidade
            WHERE id = @ProdutoId
            AND estoque >= @Quantidade";

        using var cmdEstoque = new MySqlCommand(
            sqlEstoque, conn, transaction);

        cmdEstoque.Parameters.AddWithValue(
            "@Quantidade", v.Quantidade);

        cmdEstoque.Parameters.AddWithValue(
            "@ProdutoId", v.Produto_id);

        int linhas = cmdEstoque.ExecuteNonQuery();

        if (linhas == 0)
            throw new ArgumentException(
                "Estoque insuficiente ou produto não encontrado.");

        // Registra a venda
        string sqlVenda = @"
            INSERT INTO venda
            (cliente_id, produto_id, quantidade, valor, data_venda, ativo)
            VALUES
            (@ClienteId, @ProdutoId, @Quantidade, @Valor, @DataVenda, @Ativo);

            SELECT LAST_INSERT_ID();";

        using var cmdVenda = new MySqlCommand(
            sqlVenda, conn, transaction);

        cmdVenda.Parameters.AddWithValue("@ClienteId", v.Cliente_id);
        cmdVenda.Parameters.AddWithValue("@ProdutoId", v.Produto_id);
        cmdVenda.Parameters.AddWithValue("@Quantidade", v.Quantidade);
        cmdVenda.Parameters.AddWithValue("@Valor", v.Valor);
        cmdVenda.Parameters.AddWithValue("@DataVenda", v.Data_venda);
        cmdVenda.Parameters.AddWithValue("@Ativo", v.Ativo);

        var idGerado = cmdVenda.ExecuteScalar();

        v.Id = Convert.ToInt32(idGerado);

        transaction.Commit();

        return v;
    }
    catch
    {
        transaction.Rollback();
        throw;
    }
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