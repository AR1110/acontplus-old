using Microsoft.AspNetCore.Identity;

namespace Identity.API.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
    }
}
