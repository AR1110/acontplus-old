using System.Reflection;
using Common.Infrastructure.Core.Context;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Restaurant.Api.Entities;

namespace Restaurant.Api.Data;

public class RestaurantContext(DbContextOptions<RestaurantContext> options) : BaseContext(options)
{
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

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

            foreach (var property in properties)
                builder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
        }

        foreach (var property in builder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) // Entity is a string
                                 && p.GetColumnType() == null // No column type is set
                         // Next line only required if using ASP.Net Identity:
                         //&& p.DeclaringType.GetTableName().StartsWith("AspNet")
                     ))
            property.SetIsUnicode(false);

        builder.ApplyUtcDateTimeConverter();

        SimpleEntityRegistration.RegisterEntities(builder,
            typeof(AppTable),
            typeof(Ingredient),
            typeof(Item),
            typeof(MenuItem),
            typeof(OrderDocument),
            typeof(OrderItem),
            typeof(OrderKitchen),
            typeof(Promotion),
            typeof(PromotionMenu),
            typeof(ProductionArea),
            typeof(Recipe)
        );
    }
}

public static class UtcDateAnnotation
{
    private const string IsUtcAnnotation = "IsUtc";

    private static readonly ValueConverter<DateTime, DateTime> UtcConverter =
        new(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

    private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter =
        new(v => v,
            v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));

    public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder,
        bool isUtc = true)
    {
        return builder.HasAnnotation(IsUtcAnnotation, isUtc);
    }

    private static bool IsUtc(this IMutableProperty property)
    {
        return (bool?)property.FindAnnotation(IsUtcAnnotation)?.Value ?? true;
    }

    /// <summary>
    ///     Make sure this is called after configuring all your entities.
    /// </summary>
    public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
    {
        foreach (var entityType in builder.Model.GetEntityTypes())
        foreach (var property in entityType.GetProperties())
        {
            if (!property.IsUtc()) continue;

            if (property.ClrType == typeof(DateTime)) property.SetValueConverter(UtcConverter);

            if (property.ClrType == typeof(DateTime?)) property.SetValueConverter(UtcNullableConverter);
        }
    }
}