using Restaurant.Application.Dtos.Order;

namespace Restaurant.Application.Interfaces;

public interface IOrderDetailService
{
    Task<OrderDetailItem> CreateAsync(OrderDetailCreate request);
    Task<OrderDetailItem> UpdateAsync(int id, OrderDetailUpdate request);
    Task<OrderDetailItem> GetByIdAsync(int id);
    Task<IEnumerable<OrderDetailItem>> GetByOrderIdAsync(int orderId);
    Task<IEnumerable<OrderDetailItem>> GetByStatusAsync(int status);
    Task<bool> DeleteAsync(int id);
    Task<OrderDetailItem> UpdateStatusAsync(int id, int status);
}
