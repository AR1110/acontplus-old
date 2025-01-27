namespace Inventario.API.Interfaces
{
    public interface ITarifaService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
