namespace Configuration.Application.Interfaces;

public interface IApplicationService
{
    Task<Result<IReadOnlyList<ApplicationItem>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<ApplicationItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<ApplicationItem, DomainError>> AddAsync(ApplicationCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<ApplicationItem, DomainError>> UpdateAsync(int id, ApplicationUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
