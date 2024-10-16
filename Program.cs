using Microsoft.EntityFrameworkCore;
using PracticaCrud.Data;
using PracticaCrud.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Configurar la conexión a la base de datos MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<PracticaContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Añadir servicios y controladores


// Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder => builder
            .WithOrigins("http://127.0.0.1:5500") // Especifica el origen permitido
            .AllowAnyHeader()
            .AllowAnyMethod());
});



// Agregar servicios de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Usar CORS
app.UseCors("AllowSpecificOrigins");
app.UseHttpsRedirection();

app.UseAuthorization();

// Habilitar middleware de Swagger

// Mapear controladores
app.MapControllers();

app.Run();
