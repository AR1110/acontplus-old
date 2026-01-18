namespace Configuration.Application.Interfaces;

public interface ISistemaService
{
    Task<Result<IReadOnlyList<SistemaItem>, DomainError>>
        GetAllAsync(CancellationToken cancellationToken = default);

    Task<Result<SistemaItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<SistemaItem, DomainError>> AddAsync(SistemaCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<SistemaItem, DomainError>> UpdateAsync(int id, SistemaUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
