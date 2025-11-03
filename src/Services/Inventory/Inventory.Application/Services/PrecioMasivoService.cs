namespace Inventory.Application.Services;

public class PrecioMasivoService : IPrecioMasivoService
{
    private readonly IAdoRepository _repository;

    public PrecioMasivoService(IAdoRepository repository)
    {
        _repository = repository;
    }


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Inventario.PrecioMasivo_Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Inventario.PrecioMasivo_Update", parameters);
    }
}
