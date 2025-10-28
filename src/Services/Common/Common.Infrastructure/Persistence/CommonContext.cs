using Acontplus.Notifications.Entities;
using Common.Domain.Entities;
using System.Reflection;

namespace Common.Infrastructure.Persistence;

public class CommonContext(DbContextOptions<CommonContext> options) : BaseContext(options)
{
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<Email> Emails { get; set; }
    public DbSet<HousingType> HousingTypes { get; set; }
    public DbSet<NotificationType> NotificationTypes { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<MaritalStatus> MaritalStatuses { get; set; }
    public DbSet<Priority> Priorities { get; set; }
    public DbSet<Status> Status { get; set; }
    public DbSet<WhatsAppMessage> WhatsAppMessages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        // Force all string-based columns to non-unicode equivalent
        // when no column type is explicitly set.
        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                     ))
            property.SetIsUnicode(false);
    }
}
