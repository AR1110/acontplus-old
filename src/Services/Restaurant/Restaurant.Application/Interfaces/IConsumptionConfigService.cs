namespace Restaurant.Application.Interfaces;

public interface IConsumptionConfigService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddPrinterAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetPrinterAsync(Dictionary<string, object> parameters);
}
