namespace Inventario.API.Interfaces
{
    public interface IArticuloService
    {
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> SearchAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
