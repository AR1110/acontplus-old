using Microsoft.AspNetCore.Identity;

namespace Identity.API.Entities
{
    public class AppRole : IdentityRole<string>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
