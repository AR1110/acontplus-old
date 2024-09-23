namespace Inventario.API.Interfaces
{
    public interface IMarcaService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
    } 
}
