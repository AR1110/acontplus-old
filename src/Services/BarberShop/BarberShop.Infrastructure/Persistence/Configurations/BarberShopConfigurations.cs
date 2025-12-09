namespace BarberShop.Infrastructure.Persistence.Configurations;

public class WorkSessionConfiguration : BaseEntityTypeConfiguration<WorkSession>
{
    public override void Configure(EntityTypeBuilder<WorkSession> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.StartDate)
            .HasDatabaseName("IX_Work_Session_Start_Date");

        builder.HasMany(x => x.Tickets)
            .WithOne(x => x.WorkSession)
            .HasForeignKey(x => x.WorkSessionId);

        builder.HasMany(x => x.Payments)
            .WithOne(x => x.WorkSession)
            .HasForeignKey(x => x.WorkSessionId);

        builder.ToTable("WorkSessions", "BarberShop");
    }
}

public class SeatConfiguration : BaseEntityTypeConfiguration<Seat>
{
    public override void Configure(EntityTypeBuilder<Seat> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.Code)
            .HasDatabaseName("UX_Seat_Code")
            .IsUnique();

        builder.HasMany(x => x.Tickets)
            .WithOne(x => x.Seat)
            .HasForeignKey(x => x.SeatId);

        builder.ToTable("Seats", "BarberShop");
    }
}

public class TicketConfiguration : BaseEntityTypeConfiguration<Ticket>
{
    public override void Configure(EntityTypeBuilder<Ticket> builder)
    {
        base.Configure(builder);

        builder.HasMany(x => x.TicketDetails)
            .WithOne(x => x.Ticket)
            .HasForeignKey(x => x.TicketId);

        builder.HasMany(x => x.TicketDocuments)
            .WithOne(x => x.Ticket)
            .HasForeignKey(x => x.TicketId);

        builder.ToTable("Tickets", "BarberShop");
    }
}
