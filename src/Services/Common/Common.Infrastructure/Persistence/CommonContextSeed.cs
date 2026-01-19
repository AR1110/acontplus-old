using System.Reflection;
using System.Text.Json;
using Common.Domain.Entities;

namespace Common.Infrastructure.Persistence;

public class CommonContextSeed
{
    public static async Task SeedAsync(CommonContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
