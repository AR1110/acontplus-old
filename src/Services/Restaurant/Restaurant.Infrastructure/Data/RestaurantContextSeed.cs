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
            if (!context.ItemTypes.Any())
            {
                var itemTypesData = File.ReadAllText(path + @"/Data/SeedData/ItemTypes.json");
                var itemTypes = JsonSerializer.Deserialize<List<ItemType>>(itemTypesData);
                context.ItemTypes.AddRange(itemTypes);
            }
            if (!context.MenuTypes.Any())
            {
                var menuTypeData = File.ReadAllText(path + @"/Data/SeedData/MenuType.json");
                var menuTypes = JsonSerializer.Deserialize<List<ItemType>>(menuTypeData);
                context.ItemTypes.AddRange(menuTypes);
            }
            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
