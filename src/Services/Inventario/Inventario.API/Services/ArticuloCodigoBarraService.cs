namespace Inventario.API.Services;

public class ArticuloCodigoBarraService(IAdoRepository _repository) : IArticuloCodigoBarraService
{
    private const string nameSp = "Inventario.ArticuloCodigoBarra_";
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("", parameters);
        if (ds.Tables.Count == 0)
        {
            return null;
        }

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Delete", parameters);
    }
}
