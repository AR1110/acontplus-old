namespace Accounting.Infrastructure.Persistence.Repositories;

public class CuentaPorPagarRepository(IAdoRepository _repository) : ICuentaPorPagarRepository
{
    private readonly string nameSp = "Contabilidad.CuentaPorPagar_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var response = new SpResponse
        {
            Code = null
        };
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get", parameters);
        if (ds.Tables.Count == 0)
        {
            response.Code = "0";
            response.Message = "Empty Data";
        }
        else
        {
            response.Code = "1";
            response.Payload = DataConverters.DataSetToJson(ds);
        }

        return response;
    }


    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Update", parameters);
    }

    public async Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>($"{nameSp}Delete", parameters);
    }
}
