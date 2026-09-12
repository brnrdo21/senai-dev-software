namespace MinhaApi.Models;

public class Venda
{
    public int Id {
        get; set;
    }
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