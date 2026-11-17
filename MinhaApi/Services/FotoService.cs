namespace MinhaApi.Services;

public class FotoService : IFotoService
{
    private readonly IWebHostEnvironment _env;

    public FotoService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string?> SalvarFoto(IFormFile? foto)
    {
        if (foto == null || foto.Length == 0)
            return null;

        string[] extensoesPermitidas = { ".jpg", ".jpeg", ".png", ".webp" };

        string extensao = Path.GetExtension(foto.FileName).ToLower();

        if (!extensoesPermitidas.Contains(extensao))
            throw new ArgumentException("Formato de imagem não permitido.");

        if (foto.Length > 5 * 1024 * 1024)
            throw new ArgumentException("A imagem deve ter no máximo 5 MB.");

        string pasta = Path.Combine(_env.ContentRootPath, "uploads");

        if (!Directory.Exists(pasta))
            Directory.CreateDirectory(pasta);

        string nomeArquivo = Guid.NewGuid().ToString() + extensao;

        string caminhoCompleto = Path.Combine(pasta, nomeArquivo);

        using (var stream = new FileStream(caminhoCompleto, FileMode.Create))
        {
            await foto.CopyToAsync(stream);
        }

        return Path.Combine("uploads", nomeArquivo).Replace("\\", "/");
    }

    public string? ConverterParaBase64(string? caminho)
    {
        if (string.IsNullOrWhiteSpace(caminho))
            return null;

        string caminhoCompleto = Path.Combine(
            _env.ContentRootPath,
            caminho.Replace("/", Path.DirectorySeparatorChar.ToString())
        );

        if (!File.Exists(caminhoCompleto))
            return null;

        byte[] imagem = File.ReadAllBytes(caminhoCompleto);

        string extensao = Path.GetExtension(caminho).ToLower();

        string tipo = extensao switch
        {
            ".png" => "image/png",
            ".webp" => "image/webp",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            _ => "application/octet-stream"
        };

        return $"data:{tipo};base64,{Convert.ToBase64String(imagem)}";
    }

    public void ExcluirFoto(string? caminho)
    {
        if (string.IsNullOrWhiteSpace(caminho))
            return;

        string pasta = Path.GetFullPath(
            Path.Combine(_env.ContentRootPath, "uploads")
        );

        string arquivo = Path.GetFullPath(
            Path.Combine(_env.ContentRootPath, caminho)
        );

        if (arquivo.StartsWith(pasta + Path.DirectorySeparatorChar,
            StringComparison.OrdinalIgnoreCase)
            && File.Exists(arquivo))
        {
            File.Delete(arquivo);
        }
    }
}