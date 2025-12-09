using Restaurant.Application.Dtos.Order;
using Restaurant.Domain.Repositories;

namespace Restaurant.Application.Services;

public class OrderDetailService : IOrderDetailService
{
    private readonly IOrderDetailRepository _repository;

    public OrderDetailService(IOrderDetailRepository repository)
    {
        _repository = repository;
    }

    public async Task<OrderDetailItem> CreateAsync(OrderDetailCreate request)
    {
        var parameters = new Dictionary<string, object>
        {
            ["OrderId"] = request.OrderId,
            ["ItemId"] = request.ItemId,
            ["Quantity"] = request.Quantity,
            ["UnitPrice"] = request.UnitPrice,
            ["Total"] = request.Total
        };

        var result = await _repository.AddAsync(parameters);
        return new OrderDetailItem { Id = 1 }; // Simplified return
    }

    public async Task<OrderDetailItem> UpdateAsync(int id, OrderDetailUpdate request)
    {
        var parameters = new Dictionary<string, object>
        {
            ["Id"] = id,
            ["OrderId"] = request.OrderId,
            ["ItemId"] = request.ItemId,
            ["Quantity"] = request.Quantity,
            ["UnitPrice"] = request.UnitPrice,
            ["Total"] = request.Total
        };

        await _repository.PutAsync(parameters);
        return new OrderDetailItem { Id = id }; // Simplified return
    }

    public async Task<OrderDetailItem> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { ["Id"] = id };
        var result = await _repository.GetAsync(parameters);
        return new OrderDetailItem { Id = id }; // Simplified return
    }

    public async Task<IEnumerable<OrderDetailItem>> GetByOrderIdAsync(int orderId)
    {
        var entities = await _repository.GetByOrderIdAsync(orderId);
        return entities.Select(e => new OrderDetailItem { Id = e.Id, OrderId = e.OrderId });
    }

    public async Task<IEnumerable<OrderDetailItem>> GetByStatusAsync(int status)
    {
        var entities = await _repository.GetByStatusAsync((OrderDetailStatus)status);
        return entities.Select(e => new OrderDetailItem { Id = e.Id, Status = (int)e.Status });
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var result = await _repository.DeleteAsync(1, id);
        return result.Code == "1";
    }

    public async Task<OrderDetailItem> UpdateStatusAsync(int id, int status)
    {
        var parameters = new Dictionary<string, object>
        {
            ["Id"] = id,
            ["Status"] = status
        };

        await _repository.PutAsync(parameters);
        return new OrderDetailItem { Id = id, Status = status };
    }
}
