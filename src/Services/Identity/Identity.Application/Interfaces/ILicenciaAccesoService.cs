namespace Identity.Application.Interfaces;

public interface ILicenciaAccesoService
{
    Task<Result<LicenciaAccesoItem, DomainError>> AddAsync(LicenciaAccesoCreate request, int createdByUserId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id);
    Task<Result<dynamic, DomainError>> GetAsync(Dictionary<string, object> parameters);
    Task<Result<LicenciaAccesoItem, DomainError>> UpdateAsync(int id, LicenciaAccesoUpdate request, int updatedByUserId, CancellationToken cancellationToken = default);
}