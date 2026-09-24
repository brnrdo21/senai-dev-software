using MinhaApi.Repository;
using MinhaApi.Services;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddScoped<IProdutoRepository,
ProdutoRepository>();

builder.Services.AddScoped<IClienteRepository,
ClienteRepository>();

builder.Services.AddScoped<IProdutoService,
ProdutoService>();

builder.Services.AddScoped<IClienteService,
ClienteService>();

builder.Services.AddScoped<IVendaRepository,
VendaRepository>();

builder.Services.AddScoped<IVendaService,
VendaService>();

builder.Services.AddScoped<IFornecedoresRepository,
FornecedoresRepository>();

builder.Services.AddScoped<IFornecedoresService,
FornecedoresService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();