
using MySqlConnector;

public class DashboardRepository : IDashboardRepository
{
    private readonly string _cs;

    public DashboardRepository(IConfiguration config)
    {
        _cs = config.GetConnectionString("Defaultconnection")!;
    }

    // RESUMO DO DASHBOARD
    public DashboardResumo ObterResumo(DateTime inicio)
    {
        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(@"
            SELECT
                COUNT(*) AS total_vendas,
                COALESCE(SUM(valor), 0) AS faturamento
            FROM venda
            WHERE data_venda >= @Inicio
              AND ativo = 1;

            ", conn);

        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();
        r.Read();

        var resumo = new DashboardResumo
        {
            TotalVendas = Convert.ToInt32(r["total_vendas"]),
            Faturamento = Convert.ToDecimal(r["faturamento"])
        };

        r.Close();

        using var cmdClientes = new MySqlCommand(@"
            SELECT COUNT(*)
            FROM cliente
            WHERE ativo = 1", conn);

        resumo.TotalClientes = Convert.ToInt32(
            cmdClientes.ExecuteScalar()
        );

        return resumo;
    }

    // VENDAS POR DIA
    public List<VendasPorDia> ObterVendasPorDia(DateTime inicio)
    {
        var lista = new List<VendasPorDia>();

        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(@"
            SELECT
                DATE(data_venda) AS dia,
                COUNT(*) AS qtd,
                COALESCE(SUM(valor), 0) AS total
            FROM venda
            WHERE data_venda >= @Inicio
              AND ativo = 1
            GROUP BY DATE(data_venda)
            ORDER BY dia", conn);

        cmd.Parameters.AddWithValue("@Inicio", inicio);

        using var r = cmd.ExecuteReader();

        while (r.Read())
        {
            lista.Add(new VendasPorDia
            {
                Data = Convert.ToDateTime(r["dia"]),
                Quantidade = Convert.ToInt32(r["qtd"]),
                Total = Convert.ToDecimal(r["total"])
            });
        }

        return lista;
    }

    // PRODUTOS MAIS VENDIDOS
    public List<TopProduto> ObterTopProdutos(
        DateTime inicio, int limite)
    {
        var lista = new List<TopProduto>();

        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(@"
            SELECT
                p.id,
                p.nome,
                SUM(v.quantidade) AS qtd,
                SUM(v.valor) AS total
            FROM venda v
            INNER JOIN produtos p
                ON p.id = v.produto_id
            WHERE v.data_venda >= @Inicio
              AND v.ativo = 1
            GROUP BY p.id, p.nome
            ORDER BY qtd DESC
            LIMIT @Limite", conn);

        cmd.Parameters.AddWithValue("@Inicio", inicio);
        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();

        while (r.Read())
        {
            lista.Add(new TopProduto
            {
                ProdutoId = Convert.ToInt32(r["id"]),
                Nome = r["nome"].ToString()!,
                QuantidadeVendida = Convert.ToInt32(r["qtd"]),
                Faturamento = Convert.ToDecimal(r["total"])
            });
        }

        return lista;
    }

    // PRODUTOS COM ESTOQUE BAIXO
    public List<ProdutoEstoqueBaixo> ObterEstoqueBaixo(int minimo)
    {
        var lista = new List<ProdutoEstoqueBaixo>();

        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(@"
            SELECT
                id,
                nome,
                estoque
            FROM produtos
            WHERE ativo = 1
              AND estoque <= @Minimo
            ORDER BY estoque", conn);

        cmd.Parameters.AddWithValue("@Minimo", minimo);

        using var r = cmd.ExecuteReader();

        while (r.Read())
        {
            lista.Add(new ProdutoEstoqueBaixo
            {
                Id = Convert.ToInt32(r["id"]),
                Nome = r["nome"].ToString()!,
                Estoque = Convert.ToInt32(r["estoque"])
            });
        }

        return lista;
    }

    // ÚLTIMAS VENDAS
    public List<UltimaVenda> ObterUltimasVendas(int limite)
    {
        var lista = new List<UltimaVenda>();

        using var conn = new MySqlConnection(_cs);
        conn.Open();

        using var cmd = new MySqlCommand(@"
            SELECT
                v.id,
                c.nome AS cliente,
                p.nome AS produto,
                v.quantidade,
                v.valor,
                v.data_venda
            FROM venda v
            INNER JOIN cliente c
                ON c.id = v.cliente_id
            INNER JOIN produtos p
                ON p.id = v.produto_id
            WHERE v.ativo = 1
            ORDER BY v.data_venda DESC
            LIMIT @Limite", conn);

        cmd.Parameters.AddWithValue("@Limite", limite);

        using var r = cmd.ExecuteReader();

        while (r.Read())
        {
            lista.Add(new UltimaVenda
            {
                Id = Convert.ToInt32(r["id"]),
                Cliente = r["cliente"].ToString()!,
                Produto = r["produto"].ToString()!,
                Quantidade = Convert.ToInt32(r["quantidade"]),
                ValorTotal = Convert.ToDecimal(r["valor"]),
                DataVenda = Convert.ToDateTime(r["data_venda"])
            });
        }

        return lista;
    }
}
