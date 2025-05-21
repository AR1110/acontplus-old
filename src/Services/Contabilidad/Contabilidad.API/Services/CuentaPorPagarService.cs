namespace Contabilidad.API.Services;

public class CuentaPorPagarService(IAdoRepository _repository) : ICuentaPorPagarService
{
    private readonly string nameSp = "Contabilidad.CuentaPorPagar_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var response = new ApiResponse();
        var ds = await _repository.GetDataSetAsync($"{nameSp}Get", parameters, false);
        if (ds.Tables.Count == 0)
        {
            response.Code = "0";
            response.Message = "Empty Data";
        }
        else
        {
            response.Code = "1";
            response.Payload = DataConverters.DataSetToJson(ds, true);
        }

        return response;
    }


    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>($"{nameSp}Delete", parameters);
    }
}