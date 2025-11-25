namespace Identity.Api.Entities;

[Table("LoginFailed", Schema = "Seguridad")]
public class LoginFailed : BaseEntity
{
    [MaxLength(50)] public string? Username { get; set; }

    [MaxLength(255)] public string? Password { get; set; }

    [MaxLength(2000)] public string? UserAgent { get; set; }

    [MaxLength(15)] public string? IpAddress { get; set; }
}
