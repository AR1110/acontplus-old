using FactElect.Application.DTOs.RetencionAts;

namespace FactElect.Application.Services.RetencionAts;

public class RetencionAtsService(IAdoRepository adoRepository) : IRetencionAtsService
{
    private const string ModuleName = "FactElect.RetencionAts_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Cancel", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{ModuleName}GetById", parameters);
        return !DataValidation.DataSetIsNull(ds, removeEmptyDt: true)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };

        //var response = await adoRepository.SpExecuteAsync<RetencionAtsDto>($"{ModuleName}GetById", parameters);
        //return new ApiResponse { Code = "1", Payload = response };

    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}
