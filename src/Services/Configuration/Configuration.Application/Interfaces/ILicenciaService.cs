namespace Configuration.Application.Interfaces;

public interface ILicenciaService
{
    Task<Result<LicenciaCreate, DomainError>> AddAsync(LicenciaCreate request, int createdByUserId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<LicenciaItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<LicenciaItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<LicenciaUpdate, DomainError>> UpdateAsync(int id, LicenciaUpdate request, int updatedByUserId,
        CancellationToken cancellationToken = default);
}


