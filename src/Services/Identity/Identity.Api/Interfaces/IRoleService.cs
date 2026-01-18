namespace Identity.Api.Interfaces;

public interface IRoleService
{
    Task<Result<IReadOnlyList<RoleItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<RoleItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<RoleCreatedResponse, DomainError>> AddAsync(RoleCreate request, int createdByUserId, CancellationToken cancellationToken = default);
    Task<Result<RoleItem, DomainError>> UpdateAsync(int id, RoleUpdate request, int updatedByUserId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
