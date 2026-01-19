namespace Identity.Application.Interfaces;

public interface ILicenciaAccesoDetalleService
{
    Task<Result<LicenseAccessDetails, DomainError>> AddAsync(LicenciaAccesoDetalleCreate request);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<LicenseAccessDetails, DomainError>> UpdateAsync(int id, LicenciaAccesoDetalleUpdate request);
}
