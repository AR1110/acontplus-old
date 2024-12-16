using System.Reflection;
using Common.API.Entities;

namespace Common.API.Data;

public class CommonContextSeed
{
    public static async Task SeedAsync(CommonContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.MaritalStatuses.Any())
        {
            var typesData = File.ReadAllText(path + @"/Data/SeedData/MaritalStatus.json");
            var types = JsonConvert.DeserializeObject<List<MaritalStatus>>(typesData);
            context.MaritalStatuses.AddRange(types);
        }

        if (!context.HousingTypes.Any())
        {
            var sexData = File.ReadAllText(path + @"/Data/SeedData/HousingType.json");
            var sexes = JsonConvert.DeserializeObject<List<HousingType>>(sexData);
            context.HousingTypes.AddRange(sexes);
        }



        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
