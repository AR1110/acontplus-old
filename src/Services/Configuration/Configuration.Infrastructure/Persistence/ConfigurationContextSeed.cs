using System.Text.Json;

namespace Configuration.Infrastructure.Persistence;

public class ConfigurationContextSeed
{
    public static async Task SeedAsync(ConfigurationContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.DemoSteps.Any())
        {
            var demoStepsData = File.ReadAllText(path + @"/Persistence/SeedData/DemoSteps.json");
            var demoSteps = JsonSerializer.Deserialize<List<DemoStep>>(demoStepsData);
            if (demoSteps != null)
            {
                context.DemoSteps.AddRange(demoSteps);
            }
        }

        if (!context.LicenseTypes.Any())
        {
            var licenseTypesData = File.ReadAllText(path + @"/Persistence/SeedData/LicenseType.json");
            var licenseTypes = JsonSerializer.Deserialize<List<LicenseType>>(licenseTypesData);
            if (licenseTypes != null)
            {
                context.LicenseTypes.AddRange(licenseTypes);
            }
        }

        if (!context.SubscriptionTypes.Any())
        {
            var subscriptionTypesData = File.ReadAllText(path + @"/Persistence/SeedData/SubscriptionType.json");
            var subscriptionTypes = JsonSerializer.Deserialize<List<SubscriptionType>>(subscriptionTypesData);
            if (subscriptionTypes != null)
            {
                context.SubscriptionTypes.AddRange(subscriptionTypes);
            }
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
