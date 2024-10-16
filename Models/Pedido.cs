namespace API_CRUD_P2.Models;

public class Pedido 
{

    public int Id {get;set;}

    public int UsuarioId {get;set;}

    public Usuario Usuario {get;set;}

    public List<Producto> Productos {get;set;}


}