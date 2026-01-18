namespace Identity.Api.Interfaces;

public interface ILicenciaAccesoDetalleService
{
    Task<Result<LicenciaAccesoDetalle, DomainError>> AddAsync(LicenciaAccesoDetalleCreate request);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<LicenciaAccesoDetalle, DomainError>> UpdateAsync(int id, LicenciaAccesoDetalleUpdate request);
}