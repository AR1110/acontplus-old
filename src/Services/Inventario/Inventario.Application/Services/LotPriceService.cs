namespace Inventario.Application.Services;

public class LotPriceService(IAdoRepository _repository) : ILotPriceService
{
    private readonly string nameSchema = "Inventario.PrecioMasivo";


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        var commandOptions = new CommandOptionsDto
        {
            CommandTimeout = 0
        };
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>(nameSchema + "_Update", parameters,
            commandOptions);
    }
}
