using System.Reflection;
namespace TechnicalSupport.API.Data
{
    public class TechnicalSupportContext : BaseContext
    {
        public TechnicalSupportContext(DbContextOptions<TechnicalSupportContext> options) : base(options)
        {

        }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceCustomer> DeviceCustomers { get; set; }
        public DbSet<DeviceSpecs> DeviceSpecs { get; set; }
        public DbSet<Modelo> Modelos { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<OrderDocument> OrderDocuments { get; set; }
        public DbSet<OrderMaintenance> OrderMaintenances { get; set; }
        public DbSet<OrderStatus> OrderStatuses { get; set; }
        public DbSet<Serie> Series { get; set; }
        public DbSet<WarrantyHistory> WarrantyHistories { get; set; }


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
                foreach (var property in builder.Model.GetEntityTypes()
                    .SelectMany(t => t.GetProperties())
                    .Where(
                           p => p.ClrType == typeof(string)
                        && p.GetColumnType() == null
                    ))
                {
                    property.SetIsUnicode(false);
                }
            }

            builder.Entity<Brand>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Brand>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Brand>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_Brand").IsUnique();
            builder.Entity<Brand>().HasMany(x => x.Series).WithOne(x => x.Brand).HasForeignKey(x => x.BrandId);

            builder.Entity<Category>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Category>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Category>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_Category").IsUnique();

            builder.Entity<Device>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Device>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Device>().HasMany(x => x.Customers).WithOne(x => x.Device).HasForeignKey(x => x.DeviceId);
            builder.Entity<Device>().HasOne(x => x.Specs).WithOne(x => x.Device).HasForeignKey<DeviceSpecs>(x => x.DeviceId).IsRequired();

            builder.Entity<DeviceCustomer>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<DeviceCustomer>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<DeviceSpecs>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<DeviceSpecs>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<DeviceSpecs>().HasIndex(x => x.DeviceId).HasDatabaseName("UI_TS_DS_DeviceId").IsUnique();

            builder.Entity<Modelo>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Modelo>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Modelo>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_Modelo").IsUnique();

            builder.Entity<Order>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Order>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Order>().HasMany(x => x.OrderDetails).WithOne(x => x.Order).HasForeignKey(x => x.OrderId);

            builder.Entity<OrderDocument>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderDocument>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<OrderDetail>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderDetail>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<OrderDetail>().HasMany(x => x.OrderMaintenances).WithOne(x => x.OrderDetail).HasForeignKey(x => x.OrderDetailId);

            builder.Entity<OrderMaintenance>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderMaintenance>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<OrderStatus>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderStatus>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<OrderStatus>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_OrderStatus").IsUnique();

            builder.Entity<Serie>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Serie>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Serie>().HasIndex(x => x.Code).HasDatabaseName("UI_TS_Serie").IsUnique();

            builder.Entity<WarrantyHistory>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<WarrantyHistory>().Property(x => x.Enabled).HasDefaultValue(true);
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
            var result = await base.SaveChangesAsync(cancellationToken);
            return result;
        }

    }
}
