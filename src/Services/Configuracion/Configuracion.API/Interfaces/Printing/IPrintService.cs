namespace Configuracion.API.Interfaces.Printing;

public interface IPrintService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
