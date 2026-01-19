namespace Identity.Api.Entities;

[Table("AccessAuthorization", Schema = "Access")]
public class AccessAuthorization : BaseEntity
{
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public Guid Uuid { get; set; }
    public int Code { get; set; }
}
