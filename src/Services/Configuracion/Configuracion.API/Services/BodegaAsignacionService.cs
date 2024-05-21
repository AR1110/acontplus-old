namespace Configuracion.API.Services;

public class BodegaAsignacionService : IBodegaAsignacionService
{
    private readonly IADORepository _repository;

    public BodegaAsignacionService(IADORepository repository)
    {
        _repository = repository;
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Config.Bodeg_Asig_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Config.Bodeg_Asig_Insert", parameters);
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Config.Bodeg_Asig_Update", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Contabilidad.Caja_Delete", parameters);
    }
}
