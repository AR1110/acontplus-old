using System.Reflection;
using System.Text.Json;
using Configuracion.API.Entities;

namespace Configuracion.API.Data
{
    public class ConfigContextSeed
    {
        public static async Task SeedAsync(ConfigContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.PrinterTypes.Any())
            {
                var printerTypesData = File.ReadAllText(path + @"/Data/SeedData/PrinterTypes.json");
                var printerTypes = JsonSerializer.Deserialize<List<PrinterType>>(printerTypesData);
                context.PrinterTypes.AddRange(printerTypes);
            }
            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
