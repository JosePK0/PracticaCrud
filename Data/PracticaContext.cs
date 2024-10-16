using Microsoft.EntityFrameworkCore;
using PracticaCrud.Models;

namespace PracticaCrud.Data
{
    public class PracticaContext : DbContext
    {
        public PracticaContext(DbContextOptions<PracticaContext> options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar la relación uno a muchos entre Usuario y Pedido
            

            // Configurar la relación muchos a muchos entre Pedido y Producto
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Productos)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "PedidoProducto",
                    j => j.HasOne<Producto>().WithMany().HasForeignKey("ProductoId"),
                    j => j.HasOne<Pedido>().WithMany().HasForeignKey("PedidoId"),
                    j =>
                    {
                        j.HasKey("PedidoId", "ProductoId");
                        j.ToTable("PedidoProductos");
                    });
        }
    }
}
