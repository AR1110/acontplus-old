namespace Configuracion.API.Services;

public class GeneralConfigService(IAdoRepository repository) : IGeneralConfigService
{
    private const string NameSchema = "Config.Sistema_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{NameSchema}Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "0", Message = "Data not found!" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }


    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.SpExecuteAsync<ApiResponse>($"{NameSchema}Update", parameters);
    }
}
