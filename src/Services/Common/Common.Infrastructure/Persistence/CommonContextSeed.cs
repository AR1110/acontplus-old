using System.Reflection;
using System.Text.Json;
using Common.Domain.Entities;

namespace Common.Infrastructure.Persistence;

public class CommonContextSeed
{
    public static async Task SeedAsync(CommonContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Days.Any())
        {
            var daysData = File.ReadAllText(path + @"/Persistence/SeedData/Days.json");
            var days = JsonSerializer.Deserialize<List<Days>>(daysData);
            if (days != null)
            {
                context.Days.AddRange(days);
            }
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
