namespace Inventario.Application.Interfaces;

public interface IMassiveTaxService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}