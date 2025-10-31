namespace Purchases.Infrastructure.Persistence.Repositories;

public class CompraNoHabitualRepository(IAdoRepository _repository) : ICompraNoHabitualRepository
{
    private const string moduleName = "Compra.Documento_Ingreso_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{moduleName}Get", parameters);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{moduleName}Insert", parameters);
    }

    //public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    //{
    //    var ds = await _repository.GetDataSetAsync("Compra.Liquidacion_Get_Id", parameters, true);
    //    if (ds.Tables[0].Rows.Count == 0) { return null; }
    //    return DataConverters.DataSetToJson(ds);
    //}

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{moduleName}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{moduleName}Delete", parameters);
    }
}
