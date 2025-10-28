namespace Configuracion.Domain.Repositories;

public interface IPrinterTypeRepository
{
    Task<SpResponse> GetAsync();
}
