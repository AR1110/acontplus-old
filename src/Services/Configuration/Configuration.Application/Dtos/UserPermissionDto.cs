namespace Configuration.Application.Dtos;

public record CreateUserPermissionDto
{
    public int UserRoleId { get; init; }
    public string? PermissionsData { get; init; }
}

public record UpdateUserPermissionDto
{
    public int Id { get; init; }
    public string? PermissionsData { get; init; }
    public string? DataPermissions { get; init; }
}
