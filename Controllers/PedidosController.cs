using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_CRUD_P2.Data;
using API_CRUD_P2.Models;

namespace API_CRUD_P2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidos()
        {
            return await _context.Pedidos.Include(p => p.Usuario).Include(p => p.Productos).ToListAsync();
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Productos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
            var usuario = await _context.Usuarios.FindAsync(pedido.UsuarioId);
            if (usuario == null)
            {
                return BadRequest("Usuario no encontrado");
            }

            pedido.Usuario = usuario;

            var productos = await _context.Productos
                .Where(p => pedido.Productos.Select(pp => pp.Id).Contains(p.Id))
                .ToListAsync();

            pedido.Productos = productos;

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

            var pedidoExistente = await _context.Pedidos
                .Include(p => p.Productos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pedidoExistente == null)
            {
                return NotFound();
            }

            pedidoExistente.UsuarioId = pedido.UsuarioId;

            var productos = await _context.Productos
                .Where(p => pedido.Productos.Select(pp => pp.Id).Contains(p.Id))
                .ToListAsync();

            pedidoExistente.Productos.Clear();
            foreach (var producto in productos)
            {
                pedidoExistente.Productos.Add(producto);
            }

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