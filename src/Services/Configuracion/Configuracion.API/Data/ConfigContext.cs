using System.Reflection;
using Common.Core.Entities;
using Common.Infrastructure.Data;
using Configuracion.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Configuracion.API.Data
{
    public class ConfigContext : BaseContext
    {
        public ConfigContext(DbContextOptions<ConfigContext> options) : base(options)
        {
        }
        public DbSet<Printer> Printers { get; set; }
        public DbSet<PrinterDocument> PrinterDocuments { get; set; }
        public DbSet<PrinterType> PrinterTypes { get; set; }
        public DbSet<EstablecimientoLogo> EstablecimientoLogos {  get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            if (Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer")
            {
                foreach (var entityType in builder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                    foreach (var property in properties)
                    {
                        builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                }
                // Force all string-based columns to non-unicode equivalent 
                // when no column type is explicitly set.
                foreach (var property in builder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)    // Entity is a string
                        && p.GetColumnType() == null           // No column type is set
                                                               // Next line only required if using ASP.Net Identity:
                        && p.DeclaringType.GetTableName().StartsWith("AspNet")
                    ))
                {
                    property.SetIsUnicode(false);
                }
            }

            builder.Entity<EstablecimientoLogo>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<EstablecimientoLogo>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<EstablecimientoLogo>().HasIndex(x => x.EstablecimientoId).HasDatabaseName("UI_EstabLogo_EstablecimientoId").IsUnique();

            builder.Entity<Printer>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Printer>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Printer>().HasMany(i => i.Documents).WithOne(d => d.Printer).HasForeignKey(d => d.PrinterId);


            builder.Entity<PrinterDocument>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<PrinterDocument>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<PrinterType>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<PrinterType>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<PrinterType>().HasIndex(x => x.Code).HasDatabaseName("UI_PrinterType").IsUnique();

        }

        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
                }
            }

            return base.SaveChanges();
        }
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.State == EntityState.Modified)
                {
                    ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;
                }
            }
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }
    }
}
