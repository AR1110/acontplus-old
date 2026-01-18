namespace Configuration.Application.Interfaces;

public interface IReleaseService
{
    Task<Result<IReadOnlyList<ReleaseItem>, DomainError>>
        GetAllAsync(CancellationToken cancellationToken = default);

    Task<Result<ReleaseItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<ReleaseCreatedResponse, DomainError>> AddAsync(ReleaseCreate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<ReleaseUpdatedResponse, DomainError>> UpdateAsync(int id, ReleaseUpdate request, int userId,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, int userId, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<ReleaseItem>, DomainError>> GetByAplicacionIdAsync(int aplicacionId,
        CancellationToken cancellationToken = default);
}