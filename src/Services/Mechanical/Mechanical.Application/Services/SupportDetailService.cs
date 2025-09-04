namespace Mechanical.Application.Services;

public class SupportDetailService(IAdoRepository _repository) : ISupportDetailService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Mechanical.SupportDetail_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.SupportDetail_Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.QuerySingleOrDefaultAsync<SpResponse>("Mechanical.SupportDetail_Update", parameters);
    }
}
