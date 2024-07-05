namespace Configuracion.API.Interfaces
{
    public interface IFirmaElectronicaService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
