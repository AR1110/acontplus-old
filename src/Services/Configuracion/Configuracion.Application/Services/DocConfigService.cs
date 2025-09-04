namespace Configuracion.Application.Services;

public class DocConfigService(IAdoRepository adoRepository) : IDocConfigService
{
    private const string NameSchema = "Config.DocConfig_";

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>(NameSchema + "Insert", parameters);
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync(NameSchema + "Get", parameters);
        return DataValidation.DataSetIsNull(ds) ? null : DataConverters.DataSetToJson(ds);
    }
}
