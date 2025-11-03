namespace Configuration.Application.Services;

public class GeneralConfigService(IAdoRepository repository) : IGeneralConfigService
{
    private const string NameSchema = "Config.Sistema_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "Data not found!" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }


    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{NameSchema}Update", parameters);
    }
}
