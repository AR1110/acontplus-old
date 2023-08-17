using System.Reflection;
using System.Text.Json;
using Restaurant.Core.Entities;

namespace Restaurant.Infrastructure.Data
{
    public class RestaurantContextSeed
    {
        public static async Task SeedAsync(RestaurantContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.Floors.Any())
            {
                var floorsData = File.ReadAllText(path + @"/Data/SeedData/Floors.json");
                var floors = JsonSerializer.Deserialize<List<Floor>>(floorsData);
                context.Floors.AddRange(floors);
            }
            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
