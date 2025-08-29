using Common.Core.Abstractions;

namespace Restaurant.Application.Services;

public class MenuService(IAdoRepository repository) : IMenuService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Menu_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> PutAsync(Dictionary<string, object> parameters) =>
        await repository.SpExecuteAsync<ApiResponse>("Restaurant.Menu_Update", parameters);
}
