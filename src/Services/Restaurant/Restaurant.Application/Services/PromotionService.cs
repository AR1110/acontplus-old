using Common.Core.Abstractions;

namespace Restaurant.Application.Services;

public class PromotionService(IAdoRepository repository) : IPromotionService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Promotion_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Promotion_Post", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Promotion_Update", parameters);
    }
}
