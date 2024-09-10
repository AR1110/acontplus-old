using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services;

public class MenuService(IAdoRepository repository) : IMenuService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Menu_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> PutAsync(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", request.UserRoleId },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        return await repository.SpExecuteAsync<ApiResponse>("Restaurant.Menu_Update", parameters);
    }
}
