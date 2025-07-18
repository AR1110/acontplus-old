namespace Configuracion.Domain.Repositories;

public interface IEstablecimientoLogoRepository
{
    Task<EstablecimientoLogo> GetAsync(int establecimientoId);
    Task<object> AddAsync(EstablecimientoLogo data);
    Task<object> UpdateAsync(int id, EstablecimientoLogo data);
    Task<object> DeleteAsync(int id);
}