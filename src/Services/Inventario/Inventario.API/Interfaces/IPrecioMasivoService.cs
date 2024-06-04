namespace Inventario.API.Interfaces;

public interface IPrecioMasivoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<string> UpdateAsync(Dictionary<string, object> parameters);
}
