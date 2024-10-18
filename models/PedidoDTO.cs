using System.Collections.Generic;

namespace practicacrud.Models
{
    public class PedidoDTO
    {
        public int Id { get; set; }
        public Usuario Usuario { get; set; }
        public List<Producto> Productos { get; set; }
    }
}
