namespace Identity.Api.Dtos;

public class RequestAccessDto
{
    public Guid Uuid { get; set; }
    public int UserRoleId { get; set; }
    public bool FromMobile { get; set; }
}
