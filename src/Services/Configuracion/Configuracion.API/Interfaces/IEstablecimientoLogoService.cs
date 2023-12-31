using Configuracion.API.Entities;

namespace Configuracion.API.Interfaces
{
    public interface IEstablecimientoLogoService
    {
        Task<EstablecimientoLogo> GetAsync(int id);
        Task<string> AddAsync(EstablecimientoLogo data);
        Task<string> UpdateAsync(int id, EstablecimientoLogo data);
        Task<string> DeleteAsync(int id);
    }
}
