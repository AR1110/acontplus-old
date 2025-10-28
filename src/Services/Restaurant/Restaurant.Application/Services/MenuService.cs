namespace Restaurant.Application.Services;

public class MenuService(IAdoRepository repository) : IMenuService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Menu_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> PutAsync(Dictionary<string, object> parameters) =>
        await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Menu_Update", parameters);
}
