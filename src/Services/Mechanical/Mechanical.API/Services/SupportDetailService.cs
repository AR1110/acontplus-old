using Common.Core.Abstractions;
using Mechanical.API.Interfaces;

namespace Mechanical.API.Services;

public class SupportDetailService(IAdoRepository _repository) : ISupportDetailService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Mechanical.SupportDetail_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "La transacción no devolvio respuesta" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.SupportDetail_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>("Mechanical.SupportDetail_Update", parameters);
    }
}