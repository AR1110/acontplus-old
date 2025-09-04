namespace Restaurant.Application.Services;

public class PromotionService(IAdoRepository repository) : IPromotionService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Promotion_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Promotion_Post", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Promotion_Update", parameters);
    }
}
