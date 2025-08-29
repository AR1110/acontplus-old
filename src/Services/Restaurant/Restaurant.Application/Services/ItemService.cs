using Common.Core.Abstractions;

namespace Restaurant.Application.Services;

public class ItemService(IAdoRepository adoRepository) : IItemService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_Get", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Item_Update", parameters);
}
