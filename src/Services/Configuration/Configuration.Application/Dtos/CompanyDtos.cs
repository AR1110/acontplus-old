namespace Configuration.Application.Dtos;

public record CompanyCreate(
    string IdCard,
    string BusinessName,
    string? TradeName = null,
    string? Email = null,
    string? Telephone = null,
    string? Address = null,
    int? CreatedByUserId = null);

public record CompanyUpdate(
    string IdCard,
    string BusinessName,
    string? TradeName = null,
    string? Email = null,
    string? Telephone = null,
    string? Address = null,
    int? UpdatedByUserId = null);

public record CompanyItem(
    int Id,
    Guid Uuid,
    string IdCard,
    string BusinessName,
    string? TradeName,
    string? Email,
    string? Telephone,
    string? Address,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record CompanyCreatedResponse(
    int Id,
    Guid Uuid,
    string BusinessName,
    DateTime CreatedAt);

public record CompanySearchRequest(
    string? TextSearch = null,
    int? Tipo = null,
    int? UserRoleId = null);
