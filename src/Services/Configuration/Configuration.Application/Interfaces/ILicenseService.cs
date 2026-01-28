namespace Configuration.Application.Interfaces;

public interface ILicenseService
{
    Task<Result<IReadOnlyList<LicenseItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Result<LicenseItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<LicenseCreate, DomainError>> AddAsync(LicenseCreate request, int createdByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<LicenseUpdate, DomainError>> UpdateAsync(int id, LicenseUpdate request, int updatedByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
