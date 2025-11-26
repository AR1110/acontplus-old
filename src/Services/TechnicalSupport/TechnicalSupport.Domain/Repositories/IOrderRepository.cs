using TechnicalSupport.Domain.Dtos;

namespace TechnicalSupport.Domain.Repositories;

public interface IOrderRepository
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeliveryAsync(OrderDeliveryDto deliveryDto, int id);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
