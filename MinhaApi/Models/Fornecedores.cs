using System;

namespace MinhaApi.Models;

public class Fornecedores
{
    public int Id {
        get; set;
    }
    public string Nome {
        get; set;
    }

    = string.Empty;
    public string Cnpj {
        get; set;
    }
    = string.Empty;
    public int Id_produtosF {
        get; set;
    }
    public DateTime Data_e {
        get; set;
    }
    public bool Ativo {
        get; set;
    }
    = true;
}