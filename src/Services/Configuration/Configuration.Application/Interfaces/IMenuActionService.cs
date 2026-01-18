namespace Configuration.Application.Interfaces;

public interface IMenuActionService
{
    Task<Result<MenuAction, DomainError>>
        AddAsync(MenuActionCreate request, CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<MenuAction>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<MenuAction>, DomainError>> GetAllWithIncludesAsync(
        CancellationToken cancellationToken = default);

    Task<Result<MenuAction, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<MenuAction, DomainError>> GetByIdWithIncludesAsync(int id,
        CancellationToken cancellationToken = default);

    Task<Result<MenuAction, DomainError>> UpdateAsync(int id, MenuActionUpdate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(int menuId, int actionId, int? excludeId = null,
        CancellationToken cancellationToken = default);
}