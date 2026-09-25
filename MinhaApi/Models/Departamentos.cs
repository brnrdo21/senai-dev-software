namespace MinhaApi.Models;

public class Departamentos {
    public int Id
    {
        get; set;
    }
    public String Nome
    {
        get; set;
    }
    = string.Empty;
    public String Descricao
    {
        get; set;
    }
    = string.Empty;
    public int Id_fornecedorD
    {
        get; set;
    }
    public bool Ativo
    {
        get; set;
    }
}