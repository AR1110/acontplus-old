using System.Reflection;
using System.Text.Json;
using TechnicalSupport.API.Entities;


namespace TechnicalSupport.API.Data
{
    public class TechnicalSupportContextSeed
    {
        public static async Task SeedAsync(TechnicalSupportContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.Categories.Any())
            {
                var categoriesData = File.ReadAllText(path + @"/Data/SeedData/Categories.json");
                var categories = JsonSerializer.Deserialize<List<Category>>(categoriesData);
                context.Categories.AddRange(categories);
            }
            if (!context.OrderStatuses.Any())
            {
                var statusesData = File.ReadAllText(path + @"/Data/SeedData/OrderStatuses.json");
                var statuses = JsonSerializer.Deserialize<List<OrderStatus>>(statusesData);
                context.OrderStatuses.AddRange(statuses);
            }
            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
