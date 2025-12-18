using Purchases.Application.Dtos.HabitualPurchases;


namespace Purchases.Application.Interfaces;

public interface IHabitualPurchaseService
{
    Task<Result<PagedResult<HabitualPurchaseItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<HabitualPurchaseItem, DomainError>> AddAsync(HabitualPurchaseCreate request, CancellationToken cancellationToken = default);
    Task<Result<HabitualPurchaseItem, DomainError>> UpdateAsync(int id, HabitualPurchaseUpdate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
