namespace Configuration.Application.Interfaces;

public interface IMenuService
{
    Task<Result<Menu, DomainError>> AddAsync(MenuCreate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<Menu>, DomainError>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<Menu>, DomainError>> GetAllWithApplicationAsync(
        CancellationToken cancellationToken = default);

    Task<Result<Menu, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<Menu, DomainError>> UpdateAsync(int id, MenuUpdate request, CancellationToken cancellationToken = default);
}