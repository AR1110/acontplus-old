using Microsoft.AspNetCore.Identity;

namespace Restaurant.Core.Entities
{
    public class AppUserRole : IdentityUserRole<int>
    {
        public int? CompanyId { get; set; }
        public AppUser User { get; set; }
        public AppRole Role { get; set; }
    }
}
