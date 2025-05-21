namespace Inventario.API.Interfaces;

public interface IStockService
{
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}