using Configuracion.API.Entities;

namespace Configuracion.API.Interfaces
{
    public interface IEstablecimientoLogoService
    {
        Task<EstablecimientoLogo> GetAsync(int establecimientoId);
        Task<object> AddAsync(EstablecimientoLogo data);
        Task<object> UpdateAsync(int id, EstablecimientoLogo data);
        Task<object> DeleteAsync(int id);
    }
}
