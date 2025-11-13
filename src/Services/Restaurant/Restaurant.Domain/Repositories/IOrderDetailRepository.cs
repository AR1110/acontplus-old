namespace Restaurant.Domain.Repositories;

public interface IOrderDetailRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> PutAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<IEnumerable<OrderDetail>> GetByOrderIdAsync(int orderId);
    Task<IEnumerable<OrderDetail>> GetByStatusAsync(OrderDetailStatus status);
    Task<IEnumerable<OrderDetail>> GetPendingByOrderIdAsync(int orderId);
}