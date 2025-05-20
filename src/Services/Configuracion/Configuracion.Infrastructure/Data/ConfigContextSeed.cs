using System.Reflection;

namespace Configuracion.Infrastructure.Data;

public class ConfigContextSeed
{
    public static async Task SeedAsync(ConfigContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.PrinterTypes.Any())
        {
            var printerTypesData = await File.ReadAllTextAsync(path + @"/Data/SeedData/PrinterTypes.json");
            var printerTypes = JsonConvert.DeserializeObject<List<PrinterType>>(printerTypesData);
            context.PrinterTypes.AddRange(printerTypes);
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}