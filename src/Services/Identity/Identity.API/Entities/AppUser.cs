using Microsoft.AspNetCore.Identity;

namespace Identity.API.Entities
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public Address Address { get; set; }
    }
}
