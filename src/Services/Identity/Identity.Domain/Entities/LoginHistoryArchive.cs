namespace Identity.Domain.Entities;

[Table("LoginHistoryArchive", Schema = "Auth")]
public class LoginHistoryArchive : BaseEntity
{
    public int UserRoleId { get; set; }
    [MaxLength(2000)]
    public string? UserAgent { get; set; }
    public bool? IsLoggedIn { get; set; }
    public bool? IsLocked { get; set; }
    [MaxLength(15)]
    public string? IpAddress { get; set; }
    [MaxLength(4000)]
    public string? Token { get; set; }
    public DateTime? TokenExpiration { get; set; }
}
