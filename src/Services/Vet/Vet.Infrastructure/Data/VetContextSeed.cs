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

            if (!context.Genders.Any())
            {
                var sexData = File.ReadAllText(path + @"/Data/SeedData/Genderes.json");
                var sexes = JsonSerializer.Deserialize<List<Gender>>(sexData);
                context.Genders.AddRange(sexes);
            }

            if (!context.Breeds.Any())
            {
                var breedsData = File.ReadAllText(path + @"/Data/SeedData/Breeds.json");
                var breeds = JsonSerializer.Deserialize<List<Breed>>(breedsData);
                context.Breeds.AddRange(breeds);
            }

            if (!context.DiseaseStatuses.Any())
            {
                var diseaseStatusesData = File.ReadAllText(path + @"/Data/SeedData/DiseaseStatuses.json");
                var diseaseStatuses = JsonSerializer.Deserialize<List<DiseaseStatus>>(diseaseStatusesData);
                context.DiseaseStatuses.AddRange(diseaseStatuses);
            }

            if (!context.Diseases.Any())
            {
                var diseasesData = File.ReadAllText(path + @"/Data/SeedData/Diseases.json");
                var diseases = JsonSerializer.Deserialize<List<Disease>>(diseasesData);
                context.Diseases.AddRange(diseases);
            }
            if (!context.BehaviorStatuses.Any())
            {
                var behaviorStatusesData = File.ReadAllText(path + @"/Data/SeedData/BehaviorStatuses.json");
                var behaviorStatuses = JsonSerializer.Deserialize<List<BehaviorStatus>>(behaviorStatusesData);
                context.BehaviorStatuses.AddRange(behaviorStatuses);
            }
            if (!context.Behaviors.Any())
            {
                var behaviorData = File.ReadAllText(path + @"/Data/SeedData/Behaviors.json");
                var behaviors = JsonSerializer.Deserialize<List<Behavior>>(behaviorData);
                context.Behaviors.AddRange(behaviors);
            }

            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}