using TechnicalSupport.Domain.DTOs;

namespace TechnicalSupport.Domain.Repositories;

public interface IOrderRepository
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeliveryAsync(OrderDeliveryDto deliveryDto, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
