namespace Configuration.Domain.Repositories;

public interface IPrinterTypeRepository
{
    Task<SpResponse> GetAsync();
}
