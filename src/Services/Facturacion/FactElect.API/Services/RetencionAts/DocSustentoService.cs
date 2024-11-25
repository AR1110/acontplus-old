namespace FactElect.API.Services.RetencionAts;

public interface IDocSustentoService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}

public class DocSustentoService (IAdoRepository adoRepository): IDocSustentoService
{
    private const string ModuleName = "FactElect.RetAts_Doc_Sust_";
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
