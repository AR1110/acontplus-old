using Restaurant.Application.DTOs.Orders;

namespace Restaurant.Application.Interfaces.Order;
public interface IOrderService
{
    Task<Result<PagedResult<OrderItem>, DomainError>> GetAsync(PaginationRequest paginationRequest);
    Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> CancelAsync(Dictionary<string, object> parameters);
}
