using Common.Infrastructure.Data.Repository.Interfaces;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class MenuItemService(IAdoRepository repository) : IMenuItemService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.MenuItem_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.MenuItem_Get_Id", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
