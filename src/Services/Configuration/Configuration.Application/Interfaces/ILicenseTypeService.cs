namespace Configuration.Application.Interfaces;

public interface ILicenseTypeService
{
    Task<Result<LicenseType, DomainError>> AddAsync(LicenseTypeCreate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<LicenseType>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<LicenseType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<LicenseType, DomainError>> UpdateAsync(int id, LicenseTypeUpdate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, CancellationToken cancellationToken = default,
        int? excludeId = null);
}
