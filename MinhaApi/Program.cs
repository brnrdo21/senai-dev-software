using MinhaApi.Repository;
using MinhaApi.Services;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiQWRtaW4gU0VOQUkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBzZW5haS5jb20iLCJleHAiOjE3OTQyNzI4NjYsImlzcyI6Ik1pbmhhQXBpIiwiYXVkIjoiTWluaGFBcHAifQ.ZyXNZiY0NcLpAQd-NsTt-bzlRRh_Q_lr1nmLE6tOJO0"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
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
      ValidateIssuer = true,
      ValidIssuer = builder.Configuration["Jwt:Issuer"],
      ValidateAudience = true,
      ValidAudience = builder.Configuration["Jwt:Audience"],
      ValidateLifetime = true
    };
  });

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseCors("FrontendPolicy");
app.UseAuthentication();  // 1º quem é você?
app.UseAuthorization();   // 2º você pode entrar?
app.MapControllers();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();