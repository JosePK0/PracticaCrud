using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practicacrud.Data;
using practicacrud.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace practicacrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public PedidosController(ApiDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoDTO>>> GetPedidos()
        {
            var pedidos = await _context.Pedidos
                .Include(p => p.Usuario)
                .ToListAsync();

            var pedidosDTO = new List<PedidoDTO>();

            foreach (var pedido in pedidos)
            {
               
                var productos = await _context.Productos
                    .Where(prod => pedido.Productos.Contains(prod.Id))
                    .ToListAsync();

                var pedidoDTO = new PedidoDTO
                {
                    Id = pedido.Id,
                    Usuario = pedido.Usuario,
                    Productos = productos
                };

                pedidosDTO.Add(pedidoDTO);
            }

            return pedidosDTO;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoDTO>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                return NotFound();
            }

           
            var productos = await _context.Productos
                .Where(prod => pedido.Productos.Contains(prod.Id))
                .ToListAsync();

            var pedidoDTO = new PedidoDTO
            {
                Id = pedido.Id,
                Usuario = pedido.Usuario,
                Productos = productos
            };

            return pedidoDTO;
        }

        
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
          
            var usuario = await _context.Usuarios.FindAsync(pedido.UsuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuario no encontrado");
            }

            foreach (var productoId in pedido.Productos)
            {
                if (!await _context.Productos.AnyAsync(p => p.Id == productoId))
                {
                    return BadRequest($"Producto con Id {productoId} no encontrado");
                }
            }

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPedido), new { id = pedido.Id }, pedido);
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedido(int id, Pedido pedido)
        {
            if (id != pedido.Id)
            {
                return BadRequest();
            }

            var usuario = await _context.Usuarios.FindAsync(pedido.UsuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuario no encontrado");
            }

            
            foreach (var productoId in pedido.Productos)
            {
                if (!await _context.Productos.AnyAsync(p => p.Id == productoId))
                {
                    return BadRequest($"Producto con Id {productoId} no encontrado");
                }
            }

            _context.Entry(pedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

       
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound();
            }

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidoExists(int id)
        {
            return _context.Pedidos.Any(e => e.Id == id);
        }
    }
}
