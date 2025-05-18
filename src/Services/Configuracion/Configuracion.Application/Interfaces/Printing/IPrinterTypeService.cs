namespace Configuracion.Application.Interfaces.Printing;

public interface IPrinterTypeService
{
    Task<ApiResponse> GetAsync();
}