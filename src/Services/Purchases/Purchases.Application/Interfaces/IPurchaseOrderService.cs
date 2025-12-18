using Purchases.Application.Dtos.PurchaseOrders;


namespace Purchases.Application.Interfaces;

public interface IPurchaseOrderService
{
    Task<Result<PagedResult<PurchaseOrderItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<PurchaseOrderItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<PurchaseOrderItem, DomainError>> AddAsync(PurchaseOrderCreate request, CancellationToken cancellationToken = default);
    Task<Result<PurchaseOrderItem, DomainError>> UpdateAsync(int id, PurchaseOrderUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
