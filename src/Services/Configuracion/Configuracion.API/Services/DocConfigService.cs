namespace Configuracion.API.Services;

public class DocConfigService : IDocConfigService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.DocConfig";

    public DocConfigService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync(nameSchema + "_Insert", parameters);
    }
}
