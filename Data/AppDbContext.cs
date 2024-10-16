using Microsoft.EntityFrameworkCore;
using API_CRUD_P2.Models;

namespace API_CRUD_P2.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Productos)
                .WithMany()
                .UsingEntity(j => j.ToTable("PedidoProducto"));
        }
    }
}