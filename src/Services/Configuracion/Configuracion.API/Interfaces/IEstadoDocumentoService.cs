using Common.Core.Models;

namespace Configuracion.API.Interfaces
{
    public interface IEstadoDocumentoService
    {
        Task<GenericResponse> GetAsync(string json);
    }
}
