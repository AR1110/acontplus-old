namespace Configuracion.API.Interfaces
{
    public interface IEmailConfigService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
    }
}
