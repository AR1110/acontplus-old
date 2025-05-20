namespace Inventario.API.Interfaces;

public interface ILotPriceService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}