namespace Restaurant.Infrastructure.Persistence.Repositories;

public class OrderRepository(
    IAdoRepository repository,
    RestaurantContext context)
    : IOrderRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Order_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters) =>
        await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Order_Insert", parameters);

    public async Task<SpResponse> PutAsync(Dictionary<string, object> parameters) =>
        await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Order_Update", parameters);

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null) return new SpResponse { Code = "0", Message = "Order not found" };

        order.MarkAsDeleted(userId);
        context.Update(order);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado exitosamente!" };
    }

    public async Task<SpResponse> PrintAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Order_Print", parameters);
    }
}
