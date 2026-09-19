namespace MinhaApi.Models;

public class Venda
{
    public int Id {
        get; set;
    }
    public string Cliente { 
        get; set; 
    }
    =string.Empty;

    public string Produto {
         get; set;
    }
    = string.Empty;
    public int Cliente_id {
        get; set;
    }
     public int Produto_id {
        get; set;
    }
    public int Quantidade {
        get; set;
    }
    public decimal Valor {
        get; set;
    }
    public DateTime Data_venda{
        get; set;
    }
    public bool Ativo {
        get; set;
    }
    = true;
}