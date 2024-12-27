using System.Reflection;
using Common.API.Entities;
using Common.Notifications.Entities;

namespace Common.API.Data;

public class CommonContextSeed
{
    public static async Task SeedAsync(CommonContext context)
    {
        var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);

        if (!context.MaritalStatuses.Any())
        {
            var jsonData = await File.ReadAllTextAsync(path + @"/Data/SeedData/MaritalStatus.json");
            var deserializedData = JsonConvert.DeserializeObject<List<MaritalStatus>>(jsonData);
            context.MaritalStatuses.AddRange(deserializedData);
        }

        if (!context.HousingTypes.Any())
        {
            var jsonData = await File.ReadAllTextAsync(path + @"/Data/SeedData/HousingType.json");
            var deserializedData = JsonConvert.DeserializeObject<List<HousingType>>(jsonData);
            context.HousingTypes.AddRange(deserializedData);
        }

        if (!context.NotificationTypes.Any())
        {
            var jsonData = await File.ReadAllTextAsync(path + @"/Data/SeedData/NotificationTypes.json");
            var deserializedData = JsonConvert.DeserializeObject<List<NotificationType>>(jsonData);
            context.NotificationTypes.AddRange(deserializedData);
        }

        if (!context.Priorities.Any())
        {
            var jsonData = await File.ReadAllTextAsync(path + @"/Data/SeedData/Priorities.json");
            var deserializedData = JsonConvert.DeserializeObject<List<Priority>>(jsonData);
            context.Priorities.AddRange(deserializedData);
        }

        if (!context.Status.Any())
        {
            var jsonData = await File.ReadAllTextAsync(path + @"/Data/SeedData/Status.json");
            var deserializedData = JsonConvert.DeserializeObject<List<Status>>(jsonData);
            context.Status.AddRange(deserializedData);
        }


        if (context.ChangeTracker.HasChanges())
        {
            await context.SaveChangesAsync();
        }
    }
}
