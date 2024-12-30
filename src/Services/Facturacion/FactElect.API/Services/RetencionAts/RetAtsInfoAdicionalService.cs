using FactElect.API.Interfaces.RetencionAts;

namespace FactElect.API.Services.RetencionAts;

public class RetAtsInfoAdicionalService(IAdoRepository adoRepository) : IRetAtsInfoAdicionalService
{
    private const string ModuleName = "FactElect.RetAts_InfoAdicional_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
    }
}
