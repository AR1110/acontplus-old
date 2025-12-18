namespace Purchases.Application.Interfaces;

public interface IDocumentTempService
{
    Task<Result<IReadOnlyList<object>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<object, DomainError>> AddAsync(object request, CancellationToken cancellationToken = default);
    Task<Result<object, DomainError>> UpdateAsync(int id, object request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
