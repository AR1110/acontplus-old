namespace Billing.Application.Services.Logistica;

public class GuiaRemisionService(IAdoRepository repository) : IGuiaRemisionService
{
    private const string ModuleName = "Logistica.GuiaRemision_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{ModuleName}Get_Id", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
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
