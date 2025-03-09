using Common.Infrastructure.Data.Repository.Interfaces;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class OrderService(
    IAdoRepository repository,
    RestaurantContext context)
    : IOrderService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Order_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Order_Insert", parameters);
    }

    public async Task<ApiResponse> PutAsync(int id, ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Order_Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null) { return new ApiResponse { Code = "0", Message = "Order not found" }; }

        order.Enabled = false;
        context.Update(order);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado exitosamente!" };
    }

    public async Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Order_Print", parameters);
    }
}
