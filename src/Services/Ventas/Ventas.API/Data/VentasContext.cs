namespace Ventas.API.Data;

public class VentasContext : BaseContext
{
    public VentasContext(DbContextOptions<VentasContext> options) : base(options)
    {
    }
}
