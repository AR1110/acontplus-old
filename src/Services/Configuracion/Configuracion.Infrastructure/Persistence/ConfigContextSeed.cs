namespace Configuracion.Infrastructure.Persistence;

public class ConfigContextSeed
{
    public static async Task SeedAsync(ConfigContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        if (!context.PrinterTypes.Any())
        {
            var jsonList = await File.ReadAllTextAsync(path + @"/Data/SeedData/PrinterTypes.json");
            var printerTypes = JsonSerializer.Deserialize<List<PrinterType>>(jsonList, options);
            context.PrinterTypes.AddRange(printerTypes);
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}
