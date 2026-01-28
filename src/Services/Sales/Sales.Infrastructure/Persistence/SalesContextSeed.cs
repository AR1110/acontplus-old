using System.Reflection;
using System.Text.Json;

namespace Sales.Infrastructure.Persistence;

public class SalesContextSeed
{
    public static async Task SeedAsync(SalesContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.ConsumptionPackages.Any())
        {
            var consumptionPackagesData = File.ReadAllText(path + @"/Persistence/SeedData/ConsumptionPackage.json");
            var consumptionPackages = JsonSerializer.Deserialize<List<ConsumptionPackage>>(consumptionPackagesData);
            if (consumptionPackages != null)
            {
                context.ConsumptionPackages.AddRange(consumptionPackages);
            }
        }

        if (!context.PricingPlans.Any())
        {
            var pricingPlansData = File.ReadAllText(path + @"/Persistence/SeedData/PricingPlan.json");
            var pricingPlans = JsonSerializer.Deserialize<List<PricingPlan>>(pricingPlansData);
            if (pricingPlans != null)
            {
                context.PricingPlans.AddRange(pricingPlans);
            }
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
