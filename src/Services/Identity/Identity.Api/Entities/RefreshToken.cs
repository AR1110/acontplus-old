namespace Identity.Api.Entities;

public class RefreshToken
{
    [Key] public int Id { get; set; }

    [MaxLength(4000)] public required string Token { get; set; }

    public DateTime Expires { get; set; }

    public DateTime Created { get; set; }

    [MaxLength(39)] public string? CreatedByIp { get; set; }

    public DateTime? Revoked { get; set; }

    [MaxLength(39)] public string? RevokedByIp { get; set; }

    public string? ReplacedByToken { get; set; }
    public string? DeviceInfo { get; set; } = null;
    public string? UserAgent { get; set; }
    public int AppUserId { get; set; }
    public required AppUser AppUser { get; set; }

    [NotMapped] public bool IsExpired => DateTime.UtcNow >= Expires;

    [NotMapped] public bool IsActive => Revoked == null && !IsExpired;
}
