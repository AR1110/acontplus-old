namespace Configuration.Application.Services;

public class EmailConfigService(IAdoRepository adoRepository) : IEmailConfigService
{
    private const string ModuleName = "Config.EmailConfig_";

    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new SpResponse { Code = "0", Message = "No data found" };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}_Update", parameters);
    }
}
