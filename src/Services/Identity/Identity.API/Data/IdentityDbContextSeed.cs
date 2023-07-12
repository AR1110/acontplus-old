using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Identity
{
    public class IdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                AppUser appUser = new AppUser
                {
                    DisplayName = "Ivan Paz",
                    Email = "ifer343@gmail.com",
                    UserName = "iferpaz7",
                    Address = new Address
                    {
                        FirstName = "Ivan",
                        LastName = "Paz",
                        City = "Sto. Domingo de los Tsachilas",
                        State = "Sto. Domingo",
                        Street = "Av. Abraham Calazacon",
                        ZipCode = "230103",
                    }
                };
               
                var result = await userManager.CreateAsync(appUser, "Pa$$w0rd");

                if (!result.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }

                AppUser appUserII = new AppUser
                {
                    DisplayName = "Danis Manchu",
                    Email = "dani.tumink@gmail.com",
                    UserName = "dani.manchu",
                    Address = new Address
                    {
                        FirstName = "Danis",
                        LastName = "Manchu",
                        City = "Sto. Domingo de los Tsachilas",
                        State = "Sto. Domingo",
                        Street = "Av. Abraham Calazacon",
                        ZipCode = "230103",
                    }
                };

                var resultII = await userManager.CreateAsync(appUser, "Pa$$w0rd");

                if (!resultII.Succeeded)
                {
                    throw new Exception(result.Errors.First().Description);
                }
            }
        }

    }
}
