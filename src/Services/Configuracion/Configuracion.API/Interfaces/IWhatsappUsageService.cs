namespace Configuracion.API.Interfaces
{
    public interface IWhatsappUsageService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
