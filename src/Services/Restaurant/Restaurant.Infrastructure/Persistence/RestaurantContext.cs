using System.Reflection;

namespace Restaurant.Infrastructure.Persistence;

public class RestaurantContext(DbContextOptions<RestaurantContext> options) : BaseContext(options)
{
    public DbSet<ItemType> ItemTypes { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<ItemComposition> ItemCompositions { get; set; }
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
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<OrderDetailModifier> OrderDetailModifiers { get; set; }
    public DbSet<OrderDetailCompositionModifier> OrderDetailCompositionModifiers { get; set; }
    public DbSet<OrderKitchen> OrderKitchens { get; set; }
    public DbSet<OrderDocument> OrderDocuments { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<PromotionDetail> PromotionDetails { get; set; }
    public DbSet<PromotionMenu> PromotionMenus { get; set; }

    // Meal Management
    public DbSet<MealPlan> MealPlans { get; set; }
    public DbSet<MealScheduleSetting> MealScheduleSettings { get; set; }
    public DbSet<MealPlanSchedule> MealPlanSchedules { get; set; }
    public DbSet<DailyMenu> DailyMenus { get; set; }
    public DbSet<MealConsumption> MealConsumptions { get; set; }
    public DbSet<CompanyCustomerMealPlan> CompanyCustomerMealPlans { get; set; }

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
                                 && p.GetColumnType() == null
                     ))
            property.SetIsUnicode(false);

        BaseEntityRegistration.RegisterEntities(builder, typeof(RestaurantContext),
            typeof(AppTable),
            typeof(Ingredient),
            typeof(ItemProductionArea),
            typeof(MenuItem),
            typeof(OrderDocument),
            typeof(OrderDetailCompositionModifier),
            typeof(OrderKitchen),
            typeof(PrinterSetting),
            typeof(PromotionDetail),
            typeof(PromotionMenu),
            typeof(ProductionArea),
            typeof(Recipe)
        );
    }
}
