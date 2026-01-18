using System.Reflection;
using System.Text.Json;
using Identity.Api.Entities;

namespace Identity.Api.Persistence;

public class ApplicationDbContextSeed
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Roles.Any())
        {
            var rolesData = File.ReadAllText(path + @"/Persistence/SeedData/Roles.json");
            var roles = JsonSerializer.Deserialize<List<Role>>(rolesData);
            if (roles != null)
            {
                context.Roles.AddRange(roles);
            }
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
