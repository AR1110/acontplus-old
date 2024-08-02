namespace Identity.API.Dtos;

public class RequestAccessDto
{
    public Guid Uuid { get; set; }
    public int UserRoleId { get; set; }
}
