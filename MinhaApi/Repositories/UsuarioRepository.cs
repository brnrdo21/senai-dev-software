
using MySqlConnector;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly string _cs;

    public UsuarioRepository(IConfiguration config)
    {
        _cs = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "ConnectionString DefaultConnection não encontrada.");
    }

    public Usuario? BuscarPorEmail(string email)
    {
        using var conn = new MySqlConnection(_cs);
        conn.Open();

        const string sql = @"
            SELECT id, nome, email, senha_hash, ativo
            FROM usuarios
            WHERE LOWER(TRIM(email)) = LOWER(TRIM(@Email))
            AND ativo = 1
            LIMIT 1;";

        using var cmd = new MySqlCommand(sql, conn);

        cmd.Parameters.AddWithValue("@Email", email.Trim());

        using var reader = cmd.ExecuteReader();

        if (!reader.Read())
            return null;

        return new Usuario
        {
            Id = Convert.ToInt32(reader["id"]),
            Nome = reader["nome"]?.ToString() ?? "",
            Email = reader["email"]?.ToString() ?? "",
            SenhaHash = reader["senha_hash"]?.ToString() ?? "",
            Ativo = Convert.ToBoolean(reader["ativo"])
        };
    }
}
