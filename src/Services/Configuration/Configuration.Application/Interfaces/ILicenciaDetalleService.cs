namespace Configuration.Application.Interfaces;

public interface ILicenciaDetalleService
{
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<SpResponse, DomainError>> AddAsync(LicenciaDetalle detalle);
    Task<Result<SpResponse, DomainError>> UpdateAsync(int id, LicenciaDetalle detalle);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId);
}