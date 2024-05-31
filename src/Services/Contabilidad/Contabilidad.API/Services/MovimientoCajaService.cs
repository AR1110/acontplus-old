namespace Contabilidad.API.Services;

public class MovimientoCajaService : IMovimientoCajaService
{
    private readonly ContabilidadContext _context;
    private readonly IAdoRepository _repository;
    private readonly ApiResponse _response;

    public MovimientoCajaService(IAdoRepository repository, ContabilidadContext context)
    {
        _repository = repository;
        _context = context;
        _response = new ApiResponse();
    }

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Contabilidad.MovimientoCaja_Get", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJSON(ds);
    }


    public async Task<string> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Contabilidad.MovimientoCaja_Insert", parameters);
    }

    public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteDeprecatedAsync("Contabilidad.MovimientoCaja_Delete", parameters);
    }
}
