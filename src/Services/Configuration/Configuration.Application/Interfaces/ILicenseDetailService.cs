namespace Configuration.Application.Interfaces;

public interface ILicenseDetailService
{
    Task<Result<SpResponse, DomainError>> AddAsync(LicenseDetails detalle);
    Task<Result<SpResponse, DomainError>> UpdateAsync(int id, LicenseDetails detalle);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
}
