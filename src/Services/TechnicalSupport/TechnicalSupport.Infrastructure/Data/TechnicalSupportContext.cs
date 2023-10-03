using System.Reflection;
using Common.Core.Entities;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using TechnicalSupport.Core.Entities;

namespace TechnicalSupport.Infrastructure.Data
{
    public class TechnicalSupportContext : BaseContext
    {
        public TechnicalSupportContext(DbContextOptions<TechnicalSupportContext> options) : base(options)
        {

        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }

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
                        && !p.DeclaringEntityType.GetTableName().StartsWith("AspNet")
                    ))
                {
                    property.SetIsUnicode(false);
                }
            }


            builder.Entity<Category>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Category>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Category>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_Category").IsUnique();

            builder.Entity<Product>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Product>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<OrderStatus>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderStatus>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<OrderStatus>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_OrderStatus").IsUnique();


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

                //if (entityEntry.State == EntityState.Added)
                //{
                //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
                //}
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
                //if (entityEntry.State == EntityState.Added)
                //{
                //    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
                //}
            }
            int result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }

    }
}
