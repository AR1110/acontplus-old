namespace Restaurant.Application.Interfaces;

public interface IConsumptionConfigService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddPrinterAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetPrinterAsync(Dictionary<string, object> parameters);
}