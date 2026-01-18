using System.Reflection;
using Sales.Domain.Entities;

namespace Sales.Infrastructure.Persistence;

public class SalesContext(DbContextOptions<SalesContext> options) : BaseContext(options)
{
    public DbSet<Suscripcion> Suscripciones { get; set; }
    public DbSet<SuscripcionDetalle> SuscripcionDetalles { get; set; }
    public DbSet<PricingPlan> PricingPlans { get; set; }
    public DbSet<PricingPlanFeature> PricingPlanFeatures { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<SubscriptionFeature> SubscriptionFeatures { get; set; }
    public DbSet<ConsumptionPackage> ConsumptionPackages { get; set; }
    public DbSet<ConsumptionTracking> ConsumptionTrackings { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<FeaturePolicyConfiguration> FeaturePolicyConfigurations { get; set; }
    public DbSet<FeatureUsage> FeatureUsages { get; set; }
    public DbSet<SubscriptionPlanChangeHistory> SubscriptionPlanChangeHistories { get; set; }
    public DbSet<SubscriptionRenewalHistory> SubscriptionRenewalHistories { get; set; }

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

        foreach (var property in modelBuilder.Model.GetEntityTypes()
                     .SelectMany(t => t.GetProperties())
                     .Where(p => p.ClrType == typeof(string) && p.GetColumnType() == null))
            property.SetIsUnicode(false);

        BaseEntityRegistration.RegisterEntities(modelBuilder, typeof(SalesContext),
            typeof(SuscripcionDetalle));
    }
}
