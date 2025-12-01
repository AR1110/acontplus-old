using Restaurant.Application.Dtos.Order;

namespace Restaurant.Application.Services;

public class OrderService(IAdoRepository repository) : IOrderService
{
    public async Task<Result<PagedResult<OrderItemDto>, DomainError>> GetAsync(PaginationRequest paginationRequest)
    {
        try
        {
            var response =
                await repository.GetPagedFromStoredProcedureAsync<OrderItemDto>("Restaurant.GetOrder",
                    paginationRequest);

            if (response == null || response.Items == null || !response.Items.Any())
            {
                var error = DomainError.NotFound("ORDERS_NOT_FOUND", "No orders were found.");
                return Result<PagedResult<OrderItemDto>, DomainError>.Failure(error);
            }

            return Result<PagedResult<OrderItemDto>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("ORDERS_GET_ERROR",
                $"An error occurred while retrieving orders. {ex.Message}");
            return Result<PagedResult<OrderItemDto>, DomainError>.Failure(error);
        }
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.GetByIdOrder", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.InsertOrder", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.UpdateOrder", parameters);
    }

    public async Task<SpResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.CancelOrder", parameters);
    }
}
