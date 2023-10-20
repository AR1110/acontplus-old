using Microsoft.AspNetCore.Identity;

namespace Identity.Core.Entities
{
    public class AppRole : IdentityRole<string>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}
