namespace Configuration.Application.Interfaces;

public interface IAplicacionService
{
    Task<Result<IReadOnlyList<AplicacionItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<AplicacionItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<AplicacionItem, DomainError>> AddAsync(AplicacionCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<AplicacionItem, DomainError>> UpdateAsync(int id, AplicacionUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
