namespace Identity.Application.Dtos;

public record UserRoleItem
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public Guid CompanyUuid { get; set; }
    public int RoleId { get; set; }
    public required string UserName { get; set; }
    public required string BusinessName { get; set; }
    public required string Role { get; set; }
    public bool IsActive { get; set; }
}
