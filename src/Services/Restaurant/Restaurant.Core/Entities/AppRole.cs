using Microsoft.AspNetCore.Identity;

namespace Restaurant.Core.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
