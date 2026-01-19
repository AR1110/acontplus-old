namespace Identity.Application.Dtos;

public class UserDataDto
{
    public dynamic? Actions { get; set; }
    public string? BusinessName { get; set; }
    public string? CodeRole { get; set; }
    public int CompanyId { get; set; }
    public dynamic? LicenseExpiration { get; set; }
    public dynamic? Establecimientos { get; set; }
    public string? Email { get; set; }
    public string? Fullname { get; set; }
    public string? IdCardCompany { get; set; }
    public string? IdCardUser { get; set; }
    public string? LatestVersion { get; set; }
    public required dynamic Menus { get; set; }
    public bool NeedAuthorization { get; set; }
    public dynamic? Permissions { get; set; }
    public string? ProfilePicture { get; set; }
    public string? Role { get; set; }
    public string? ReturnUrl { get; set; }
    public string? Token { get; set; }
    public string? TradeName { get; set; }
    public string? UserAgent { get; set; }
    public string? UrlGateway { get; set; }
    public int UserId { get; set; }
    public required string Username { get; set; }
    public int UserRoleId { get; set; }
    public string? Uuid { get; set; }
    public dynamic? PermissionsData { get; set; }
}
