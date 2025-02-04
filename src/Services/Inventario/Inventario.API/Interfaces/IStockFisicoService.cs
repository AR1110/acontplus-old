using Common.AppSettings;

namespace Inventario.API.Interfaces;

public interface IStockFisicoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<LegacyApiResponse> UpdateAsync(int id, ApiRequest data);
}
