
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        IAuthService authService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Senha))
            {
                return BadRequest(new
                {
                    message = "Informe o e-mail e a senha."
                });
            }

            var response = _authService.Login(request);

            return Ok(response);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new
            {
                message = "E-mail ou senha inválidos."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno durante o login.");

            return StatusCode(500, new
            {
                message = "Erro interno ao realizar login."
            });
        }
    }
}
