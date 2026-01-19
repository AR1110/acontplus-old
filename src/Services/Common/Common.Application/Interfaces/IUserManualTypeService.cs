namespace Common.Application.Interfaces;

public interface IUserManualTypeService
{
    Task<Result<UserManualType, DomainError>> AddAsync(UserManualTypeCreate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<UserManualType>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<UserManualType, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<UserManualType, DomainError>> UpdateAsync(int id, UserManualTypeUpdate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsByCodeAsync(string code, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
