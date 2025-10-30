namespace Inventory.Application.Services;

public class ArticuloCodigoBarraService(IAdoRepository _repository) : IArticuloCodigoBarraService
{
    private const string nameSp = "Inventario.ArticuloCodigoBarra_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Delete", parameters);
    }
}
