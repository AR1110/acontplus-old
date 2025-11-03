namespace Billing.Application.Services.Logistica;

public class GuiaRemisionService(IAdoRepository repository) : IGuiaRemisionService
{
    private const string ModuleName = "Logistica.GuiaRemision_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return ds.Tables.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Id", parameters);
        return ds.Tables[0].Rows.Count == 0 ? null : (object)DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
    }
}
