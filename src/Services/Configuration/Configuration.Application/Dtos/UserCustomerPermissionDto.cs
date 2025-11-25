namespace Configuration.Application.Dtos;

public record CreateUserCustomerPermissionDto
{
    public int UserRoleId { get; init; }
    public string? PermissionsData { get; init; }
}

public record UpdateUserCustomerPermissionDto
{
    public int Id { get; init; }
    public string? PermissionsData { get; init; }
    public string? DataPermissions { get; init; }
}