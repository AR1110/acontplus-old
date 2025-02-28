namespace FactElect.API.Interfaces.RetencionAts;

public interface IRetencionAtsService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
