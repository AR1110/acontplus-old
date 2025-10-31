namespace Purchases.Infrastructure.Persistence;

public class PurchasesContext : BaseContext
{
    public PurchasesContext(DbContextOptions<PurchasesContext> options) : base(options)
    {
    }
}
