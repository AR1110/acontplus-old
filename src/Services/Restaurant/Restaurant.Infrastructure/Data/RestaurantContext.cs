using System.Reflection;
using Common.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Restaurant.Core.Entities;
using Common.Core.Entities;

namespace Restaurant.Infrastructure.Data
{
    public class RestaurantContext : BaseContext
    {
        public RestaurantContext(DbContextOptions<RestaurantContext> options) : base(options)
        {

        }
        public DbSet<ItemType> ItemTypes { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<IngredientType> IngredientTypes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<ProductionArea> ProductionAreas { get; set; }
        public DbSet<MenuType> MenuTypes { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Floor> Floors { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<AppTable> Tables { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderKitchen> OrderKitchens { get; set; }
        public DbSet<OrderDocument> OrderDocuments { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<PromotionMenu> PromotionMenus { get; set; }

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
            }

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

            builder.ApplyUtcDateTimeConverter();

            builder.Entity<ItemType>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<ItemType>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<ItemType>().HasIndex(x => x.Code).HasDatabaseName("UI_ItemType").IsUnique();

            builder.Entity<Item>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Item>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<Recipe>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Recipe>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<IngredientType>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<IngredientType>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<IngredientType>().HasIndex(x => x.Code).HasDatabaseName("UI_IngredientType").IsUnique();

            builder.Entity<Ingredient>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Ingredient>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<ProductionArea>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<ProductionArea>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<ProductionArea>().HasIndex(x => x.Code).HasDatabaseName("UI_ProductionArea").IsUnique();

            builder.Entity<Floor>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Floor>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<Room>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Room>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<AppTable>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<AppTable>().Property(x => x.Enabled).HasDefaultValue(true);


            builder.Entity<MenuType>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<MenuType>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<MenuType>().HasIndex(x => x.Code).HasDatabaseName("UI_MenuType").IsUnique();

            builder.Entity<Menu>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Menu>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Menu>().HasMany(x => x.MenuItems).WithOne(m => m.Menu).HasForeignKey(m => m.MenuId);

            builder.Entity<MenuItem>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<MenuItem>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<Order>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Order>().Property(x => x.Divided).HasDefaultValue(false);
            builder.Entity<Order>().Property(x => x.Enabled).HasDefaultValue(true);
            builder.Entity<Order>().HasMany(x => x.OrderItems).WithOne(m => m.Order).HasForeignKey(m => m.OrderId);

            builder.Entity<OrderItem>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderItem>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<OrderKitchen>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderKitchen>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<OrderDocument>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<OrderDocument>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<Promotion>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<Promotion>().Property(x => x.Enabled).HasDefaultValue(true);

            builder.Entity<PromotionMenu>().Property(x => x.CreatedAt).HasDefaultValueSql("GETDATE()");
            builder.Entity<PromotionMenu>().Property(x => x.Enabled).HasDefaultValue(true);

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
                ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.Now;
                }
            }

            return base.SaveChanges();
        }

    }

    public static class UtcDateAnnotation
    {
        private const String IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
          new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
          new ValueConverter<DateTime?, DateTime?>(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder, Boolean isUtc = true) =>
          builder.HasAnnotation(IsUtcAnnotation, isUtc);

        public static Boolean IsUtc(this IMutableProperty property) =>
          ((Boolean?)property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc())
                    {
                        continue;
                    }

                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(UtcConverter);
                    }

                    if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(UtcNullableConverter);
                    }
                }
            }
        }
    }
}
