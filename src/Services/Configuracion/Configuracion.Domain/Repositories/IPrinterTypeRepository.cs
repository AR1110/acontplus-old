namespace Configuracion.Domain.Repositories;

public interface IPrinterTypeRepository
{
    Task<ApiResponse> GetAsync();
}