namespace Identity.Api.Interfaces;

public interface ILicenseAccessDetailService
{
    Task<Result<LicenseAccessDetails, DomainError>> AddAsync(LicenseAccessDetailCreate request);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<LicenseAccessDetails, DomainError>> UpdateAsync(int id, LicenseAccessDetailUpdate request);
}
