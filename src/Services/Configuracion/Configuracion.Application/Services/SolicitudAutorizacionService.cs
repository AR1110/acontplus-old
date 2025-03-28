 

namespace Configuracion.Application.Services;

public class SolicitudAutorizacionService (IAdoRepository _repo) : ISolicitudAutorizacionService
{ 
    private readonly string nameSchema = "Config.SolicitudAutorizacion_";
 

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    { 
        var ds = await _repo.GetDataSetAsync($"{nameSchema}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new ApiResponse { Code = "0", Message = "No data found" }; 
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await _repo.SpExecuteAsync<ApiResponse>(nameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repo.SpExecuteAsync<ApiResponse>(nameSchema + "Update", parameters);
    }
}
