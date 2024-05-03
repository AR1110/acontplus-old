using System.Reflection;


namespace TechnicalSupport.API.Data
{
    public class TechnicalSupportContextSeed
    {
        public static async Task SeedAsync(TechnicalSupportContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.OrderStatuses.Any())
            {
                var statusesData = File.ReadAllText(path + @"/Data/SeedData/OrderStatuses.json");
                var statuses = JsonConvert.DeserializeObject<List<OrderStatus>>(statusesData);
                context.OrderStatuses.AddRange(statuses);
            }
            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
