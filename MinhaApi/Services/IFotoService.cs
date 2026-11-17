namespace MinhaApi.Services;

public interface IFotoService
{
    Task<string?> SalvarFoto(IFormFile? foto);
    string? ConverterParaBase64(string? caminho);
    void ExcluirFoto(string? caminho);
}