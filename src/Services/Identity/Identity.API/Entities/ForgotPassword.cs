namespace Identity.API.Entities;

[Table("ForgotPassword", Schema = "Seguridad")]
public class ForgotPassword : BaseEntity
{
    [Required][MaxLength(100)] public required string Email { get; set; }

    [Required] public Guid Token { get; set; } = Guid.NewGuid();

    public DateTime Expiration { get; set; } = DateUtils.GetEcuadorDate().AddMinutes(5);
}
