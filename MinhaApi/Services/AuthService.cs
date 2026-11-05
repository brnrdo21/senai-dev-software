
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _repo;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUsuarioRepository repo,
        IConfiguration config,
        ILogger<AuthService> logger)
    {
        _repo = repo;
        _config = config;
        _logger = logger;
    }

    public LoginResponse Login(LoginRequest req)

    {
        
        if (req == null ||
            string.IsNullOrWhiteSpace(req.Email) ||
            string.IsNullOrWhiteSpace(req.Senha))
        {
            throw new UnauthorizedAccessException(
                "Credenciais inválidas.");
        }

        // 1. Busca o usuário pelo e-mail
        var usuario = _repo.BuscarPorEmail(req.Email.Trim());

        if (usuario == null)
        {
            throw new UnauthorizedAccessException(
                "Credenciais inválidas.");
        }

        // 2. Verifica se existe hash de senha
        if (string.IsNullOrWhiteSpace(usuario.SenhaHash))
        {
            _logger.LogError(
                "O usuário {Email} não possui hash de senha cadastrado.",
                usuario.Email);

            throw new InvalidOperationException(
                "Hash de senha não encontrado.");
        }

        // 3. Verifica a senha
        bool senhaOk;

        try
        {
            senhaOk = BCrypt.Net.BCrypt.Verify(
                req.Senha,
                usuario.SenhaHash);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao verificar o hash da senha do usuário {Email}.",
                usuario.Email);

            throw new InvalidOperationException(
                "Não foi possível verificar a senha.");
        }

        if (!senhaOk)
        {
            throw new UnauthorizedAccessException(
                "Credenciais inválidas.");
        }

        // 4. Gera o token JWT
        string token = GerarToken(usuario);

        // 5. Retorna os dados do usuário
        return new LoginResponse
        {
            Token = token,
            Nome = usuario.Nome,
            Email = usuario.Email
        };
    }

    private string GerarToken(Usuario usuario)
    {
        // Busca as configurações JWT
        string? chave = _config["Jwt:Key"];
        string? issuer = _config["Jwt:Issuer"];
        string? audience = _config["Jwt:Audience"];
        string? expiracaoConfig = _config["Jwt:ExpiresInMinutes"];

        // Verifica se as configurações existem
        if (string.IsNullOrWhiteSpace(chave))
        {
            throw new InvalidOperationException(
                "Jwt:Key não foi configurada.");
        }

        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new InvalidOperationException(
                "Jwt:Issuer não foi configurado.");
        }

        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException(
                "Jwt:Audience não foi configurado.");
        }

        // Verifica se a chave possui tamanho adequado
        byte[] chaveBytes = Encoding.UTF8.GetBytes(chave);

        if (chaveBytes.Length < 32)
        {
            throw new InvalidOperationException(
                "A chave JWT precisa ter pelo menos 32 bytes.");
        }

        // Verifica a expiração
        if (!double.TryParse(
            expiracaoConfig,
            NumberStyles.Number,
            CultureInfo.InvariantCulture,
            out double minutos) || minutos <= 0)
        {
            throw new InvalidOperationException(
                "Jwt:ExpiresInMinutes está ausente ou inválido.");
        }

        // Cria a chave de assinatura
        var key = new SymmetricSecurityKey(chaveBytes);

        // Define o algoritmo de assinatura
        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        // Define as informações do usuário
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                usuario.Nome ?? string.Empty),

            new Claim(
                ClaimTypes.Email,
                usuario.Email ?? string.Empty)
        };

        // Define a validade do token
        var expiracao = DateTime.UtcNow.AddMinutes(minutos);

        // Monta o token
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiracao,
            signingCredentials: credentials
        );

        // Converte para string
        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
