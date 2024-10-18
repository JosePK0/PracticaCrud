using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace practicacrud.Models
{
    public class Pedido
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        [JsonIgnore]
        public Usuario? Usuario { get; set; }

        [Required]
        public List<int> Productos { get; set; }
    }
}
