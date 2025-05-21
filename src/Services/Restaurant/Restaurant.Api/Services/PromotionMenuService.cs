using Common.Infrastructure.Data.Repository.Interfaces;

namespace Restaurant.Api.Services;

public interface IPromotionMenuService
{
    public Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters);
}

public class PromotionMenuService(IAdoRepository repository) : IPromotionMenuService
{
    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Promotion_Menu_Get_By_Id", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}