namespace Identity.Application.Interfaces;

public interface ILicenseAccessService
{
    Task<Result<LicenseAccessItem, DomainError>> AddAsync(LicenseAccessCreate request, int createdByUserId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<LicenseAccessItem, DomainError>> UpdateAsync(int id, LicenseAccessUpdate request, int updatedByUserId, CancellationToken cancellationToken = default);
}
