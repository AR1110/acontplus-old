using System.Reflection;
using Newtonsoft.Json;

namespace Contabilidad.API.Data;

public class ContabilidadContextSeed
{
    public static async Task SeedAsync(ContabilidadContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.Tipos.Any())
        {
            var tiposData = File.ReadAllText(path + @"/Data/SeedData/Tipos.json");
            var tipos = JsonConvert.DeserializeObject<List<Tipo>>(tiposData);
            context.Tipos.AddRange(tipos);
        }

        if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
    }
}