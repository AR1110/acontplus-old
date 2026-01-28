namespace Configuration.Application.Interfaces;

public interface ISystemService
{
    Task<Result<IReadOnlyList<SystemItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<SystemItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<SystemItem, DomainError>> AddAsync(SystemCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<SystemItem, DomainError>> UpdateAsync(int id, SystemUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
