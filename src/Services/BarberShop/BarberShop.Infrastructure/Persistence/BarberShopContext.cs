using System.Reflection;

namespace BarberShop.Infrastructure.Persistence;

public class BarberShopContext(DbContextOptions<BarberShopContext> options) : BaseContext(options)
{
    public DbSet<BarberPayment> BarberPayments { get; set; } = null!;

    public DbSet<Seat> Seats { get; set; } = null!;

    public DbSet<Ticket> Tickets { get; set; } = null!;

    public DbSet<TicketDetail> TicketDetails { get; set; } = null!;

    public DbSet<TicketDocument> TicketDocuments { get; set; } = null!;

    public DbSet<WorkSession> WorkSessions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        SimpleEntityRegistration.RegisterEntities(modelBuilder,
            typeof(TicketDocument));

    }
}
