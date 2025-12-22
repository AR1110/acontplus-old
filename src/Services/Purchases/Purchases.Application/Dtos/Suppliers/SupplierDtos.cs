namespace Purchases.Application.Dtos.Suppliers;

public record SupplierCreate(
    int IdentificationTypeId,
    string IdentificationNumber,
    string LegalName,
    string TradeName,
    int? CityId,
    int? CustomerSupplierTypeId,
    int? EntityTypeId,
    int? TaxpayerSubTypeId,
    int? CreditTermId,
    string? Address,
    string? Phone,
    string? Email,
    int UserRoleId);

public record SupplierUpdate(
    int Id,
    int IdentificationTypeId,
    string IdentificationNumber,
    string LegalName,
    string TradeName,
    int? CityId,
    int? CustomerSupplierTypeId,
    int? EntityTypeId,
    int? TaxpayerSubTypeId,
    int? CreditTermId,
    string? Address,
    string? Phone,
    string? Email,
    bool IsActive);

public record SupplierItem(
    int Id,
    int IdentificationTypeId,
    string IdentificationNumber,
    string LegalName,
    string TradeName,
    int? CityId,
    int? CustomerSupplierTypeId,
    int? EntityTypeId,
    int? TaxpayerSubTypeId,
    int? CreditTermId,
    string? Address,
    string? Phone,
    string? Email,
    bool IsActive);
