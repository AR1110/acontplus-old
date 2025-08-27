namespace Compras.Infrastructure.Persistence;

public class ComprasContext : BaseContext
{
    public ComprasContext(DbContextOptions<ComprasContext> options) : base(options)
    {
    }
}