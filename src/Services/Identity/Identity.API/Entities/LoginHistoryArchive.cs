namespace Identity.API.Entities;

[Table("LoginHistoryArchive", Schema = "Seguridad")]
public class LoginHistoryArchive : BaseEntity
{
    public string Username { get; set; }
    public int UserRoleId { get; set; }
    public string UserAgent { get; set; }
    public DateTime LoginDate { get; set; }
    public bool? IsLoggedIn { get; set; }
    public bool? IsLocked { get; set; }
    [MaxLength(15)] public string IpAddress { get; set; }
    public string Token { get; set; }
    public DateTime? TokenExpiration { get; set; }
}
