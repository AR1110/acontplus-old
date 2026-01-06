using Purchases.Application.Dtos.Orders;

namespace Purchases.Application.Interfaces;

public interface IOrderService
{
    Task<Result<PagedResult<OrderItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default);
    Task<Result<OrderItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<OrderItem, DomainError>> AddAsync(OrderCreate request, CancellationToken cancellationToken = default);
    Task<Result<OrderItem, DomainError>> UpdateAsync(int id, OrderUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
