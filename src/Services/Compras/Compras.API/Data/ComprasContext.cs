namespace Compras.API.Data;

public class ComprasContext : BaseContext
{
    public ComprasContext(DbContextOptions<ComprasContext> options) : base(options)
    {
    }
}