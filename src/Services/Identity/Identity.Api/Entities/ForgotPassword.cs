namespace Identity.Api.Entities;

[Table("ForgotPassword", Schema = "Auth")]
public class ForgotPassword : BaseEntity
{
    [MaxLength(100)] public required string Email { get; set; }

    public Guid Token { get; set; } = Guid.NewGuid();

    public DateTime Expiration { get; set; } = DateUtils.GetEcuadorDate().AddMinutes(5);
}
