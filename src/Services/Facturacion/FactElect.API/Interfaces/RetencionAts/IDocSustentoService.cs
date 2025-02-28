namespace FactElect.API.Interfaces.RetencionAts;
public interface IDocSustentoService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
