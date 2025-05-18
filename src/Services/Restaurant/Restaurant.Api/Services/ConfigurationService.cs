using Common.Infrastructure.Data.Repository.Interfaces;

namespace Restaurant.Api.Services;

public interface IConfigurationService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}

public class ConfigurationService(IAdoRepository repository) : IConfigurationService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Configuration_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
