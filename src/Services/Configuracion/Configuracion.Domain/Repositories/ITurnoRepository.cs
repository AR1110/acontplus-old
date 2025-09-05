using Configuracion.Domain.Models;

namespace Configuracion.Domain.Repositories;

public interface ITurnoRepository
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> CreateTurnoAsync(int userRoleId, Turno turno);
    Task<SpResponse> UpdateTurnoAsync(int userRoleId, Turno turno);
    Task<SpResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);
    Task<SpResponse> DeleteTurnoAsync(int userRoleId, int idTurno);
}
