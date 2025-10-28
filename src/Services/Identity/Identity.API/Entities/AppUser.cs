namespace Identity.API.Entities;

public class AppUser : IdentityUser<int>
{
    [MaxLength(100)] public string? DisplayName { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public UserProfile? UserProfile { get; set; }
}
