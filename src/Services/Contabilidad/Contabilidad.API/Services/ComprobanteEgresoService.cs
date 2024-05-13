namespace Contabilidad.API.Services;

public class ComprobanteEgresoService : IComprobanteEgresoService
{
    private readonly ContabilidadContext _context;
    private readonly IADORepository _repository;
    private readonly ApiResponse _response;

    public ComprobanteEgresoService(IADORepository repository, ContabilidadContext context)
    {
        _repository = repository;
        _context = context;
        _response = new ApiResponse();
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Contabilidad.ComprobanteEgreso_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Contabilidad.ComprobanteEgreso_Insert", parameters);
    }

    public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Contabilidad.ComprobanteEgreso_Update", parameters);
    }


    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SPExecuteDeprecatedAsync("Contabilidad.ComprobanteEgreso_Update_Cancel", parameters);
    }
}
