namespace Inventory.Application.Interfaces;

public interface IPrecioMasivoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
