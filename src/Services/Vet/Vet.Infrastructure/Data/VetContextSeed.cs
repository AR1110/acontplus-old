using System.Reflection;
using System.Text.Json;
using Vet.Core.Entities;

namespace Vet.Infrastructure.Data
{
    public class VetContextSeed
    {
        public static async Task SeedAsync(VetContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

            if (!context.PetTypes.Any())
            {
                var typesData = File.ReadAllText(path + @"/Data/SeedData/PetTypes.json");
                var types = JsonSerializer.Deserialize<List<PetType>>(typesData);
                context.PetTypes.AddRange(types);
            }

            if (!context.PetSexs.Any())
            {
                var sexData = File.ReadAllText(path + @"/Data/SeedData/PetSexes.json");
                var sexes = JsonSerializer.Deserialize<List<PetSex>>(sexData);
                context.PetSexs.AddRange(sexes);
            }

            if (!context.PetBreeds.Any())
            {
                var breedsData = File.ReadAllText(path + @"/Data/SeedData/PetBreeds.json");
                var breeds = JsonSerializer.Deserialize<List<PetBreed>>(breedsData);
                context.PetBreeds.AddRange(breeds);
            }

            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}