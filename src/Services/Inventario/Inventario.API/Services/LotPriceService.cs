namespace Inventario.API.Services;

public class LotPriceService(IAdoRepository _repository) : ILotPriceService
{
    private readonly string nameSchema = "Inventario.PrecioMasivo";


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "_Update", parameters, false);
    }
}