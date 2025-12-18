using Purchases.Application.Dtos.NonHabitualPurchases;


namespace Purchases.Application.Interfaces;

public interface INonHabitualPurchaseService
{
    Task<Result<PagedResult<NonHabitualPurchaseItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<NonHabitualPurchaseItem, DomainError>> AddAsync(NonHabitualPurchaseCreate request, CancellationToken cancellationToken = default);
    Task<Result<NonHabitualPurchaseItem, DomainError>> UpdateAsync(int id, NonHabitualPurchaseUpdate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
