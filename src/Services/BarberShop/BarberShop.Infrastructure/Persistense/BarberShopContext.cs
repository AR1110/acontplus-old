namespace BarberShop.Infrastructure.Persistense;

public class BarberShopContext(DbContextOptions<BarberShopContext> options) : DbContext(options)
{
    public DbSet<Seat> Seats { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Add your custom model configurations here
    }
}
