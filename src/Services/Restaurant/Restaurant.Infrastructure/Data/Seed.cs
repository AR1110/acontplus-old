using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Restaurant.Core.Entities;
using System.Reflection;
using System.Text.Json;

namespace Restaurant.Infrastructure.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager,
           RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var userData = await File.ReadAllTextAsync(path + @"/Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Casher"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Chef"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "edi12345");
                await userManager.AddToRoleAsync(user, "Admin");
            }

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "edi12345");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Casher" });
        }
    }
}
