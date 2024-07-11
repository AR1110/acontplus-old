using System.Reflection; 
using Common.API.Data;
using Common.API.Entities;

namespace Common.API.Data;

public class CommonContextSeed
{
    public static async Task SeedAsync(CommonContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.EstadosCivil.Any())
        {
            var typesData = File.ReadAllText(path + @"/Data/SeedData/EstadosCivil.json");
            var types = JsonConvert.DeserializeObject<List<EstadoCivil>>(typesData);
            context.EstadosCivil.AddRange(types);
        }

        if (!context.TiposVivienda.Any())
        {
            var sexData = File.ReadAllText(path + @"/Data/SeedData/TiposVivienda.json");
            var sexes = JsonConvert.DeserializeObject<List<TipoVivienda>>(sexData);
            context.TiposVivienda.AddRange(sexes);
        }

         

        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
