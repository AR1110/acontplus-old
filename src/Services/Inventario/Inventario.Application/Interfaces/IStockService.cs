namespace Inventario.Application.Interfaces;

public interface IStockService
{
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
