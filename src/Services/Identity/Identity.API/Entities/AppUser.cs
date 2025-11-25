namespace Identity.Api.Entities;

public class AppUser : IdentityUser<int>
{
    [MaxLength(100)] public string? DisplayName { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
    public UserProfile? UserProfile { get; set; }
}
