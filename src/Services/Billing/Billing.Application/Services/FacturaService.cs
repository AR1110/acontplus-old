namespace Billing.Application.Services;

public class FacturaService(IAdoRepository repository) : IFacturaService
{
    private const string ModuleName = "Ventas.Factura_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync(ModuleName + "Get", parameters);
        if (DataValidation.DataSetIsNull(ds)) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync(ModuleName + "Get_Id", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>(ModuleName + "Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>(ModuleName + "Update", parameters);
    }

    public async Task<SpResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>(ModuleName + "Cancel", parameters);
    }
}
