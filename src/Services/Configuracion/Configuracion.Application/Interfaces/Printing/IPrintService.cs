namespace Configuracion.Application.Interfaces.Printing;

public interface IPrintService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}