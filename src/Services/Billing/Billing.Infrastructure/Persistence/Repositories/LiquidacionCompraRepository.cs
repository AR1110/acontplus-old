namespace Billing.Infrastructure.Persistence.Repositories;

public class LiquidacionCompraRepository(IAdoRepository adoRepository) : ILiquidacionCompraRepository
{
    private const string ModuleName = "Compra.Liquidacion_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return ds.Tables[0].Rows.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get_Id", parameters);
        return ds.Tables[0].Rows.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }
}
