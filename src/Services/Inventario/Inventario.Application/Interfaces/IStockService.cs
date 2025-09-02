namespace Inventario.Application.Interfaces;

public interface IStockService
{
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}