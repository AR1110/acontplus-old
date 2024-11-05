namespace Configuracion.API.Interfaces
{
    public interface IWhatsappUsageService
    {
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
