using Contabilidad.Domain.Repositories;

namespace Contabilidad.Infrastructure.Persistence.Repositories;

public class ComprobanteEgresoRepository(IAdoRepository _repository) : IComprobanteEgresoRepository
{
    private readonly string nameSchema = "Contabilidad.ComprobanteEgreso_";


    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync($"{nameSchema}Get", parameters);
        if (ds.Tables.Count == 0) return null;

        return DataConverters.DataSetToJson(ds);
    }


    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSchema}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSchema}Update", parameters);
    }


    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSchema}Update_Cancel", parameters);
    }
}