namespace FactElect.Application.Interfaces.RetencionAts;

public interface IRetencionAtsInfoAdicionalService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}