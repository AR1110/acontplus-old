namespace Restaurant.Application.Services;

public interface IConfigurationService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}

public class ConfigurationService(IAdoRepository repository) : IConfigurationService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Configuration_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
