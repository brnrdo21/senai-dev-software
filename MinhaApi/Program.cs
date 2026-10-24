using MinhaApi.Repository;
using MinhaApi.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddCors(options => {
    options.AddPolicy("FrontendPolicy", policy => {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

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

builder.Services.AddScoped<IDepartamentosRepository,
DepartamentosRepository>();

builder.Services.AddScoped<IDepartamentosService,
DepartamentosService>();

var jwtKey = builder.Configuration["Jwt:Key"]!;

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(opt => {
    opt.TokenValidationParameters = new TokenValidationParameters {
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(jwtKey)),
      ValidateIssuer   = true,
      ValidIssuer      = builder.Configuration["Jwt:Issuer"],
      ValidateAudience = true,
      ValidAudience    = builder.Configuration["Jwt:Audience"],
      ValidateLifetime = true
    };
  });

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseCors(/* sua política */);
app.UseAuthentication();  // 1º quem é você?
app.UseAuthorization();   // 2º você pode entrar?
app.MapControllers();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendPolicy");
app.MapControllers();
app.Run();