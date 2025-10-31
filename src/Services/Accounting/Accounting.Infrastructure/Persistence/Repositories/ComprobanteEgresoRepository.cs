namespace Accounting.Infrastructure.Persistence.Repositories;

public class ComprobanteEgresoRepository(IAdoRepository _repository) : IComprobanteEgresoRepository
{
    private readonly string nameSchema = "Contabilidad.ComprobanteEgreso_";


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSchema}Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSchema}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSchema}Update", parameters);
    }


    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSchema}Update_Cancel", parameters);
    }
}
