namespace Configuracion.Domain.Repositories;

public interface ITurnoRepository
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
    Task<LegacySpResponse> CreateTurnoAsync(int userRoleId, Turno turno);
    Task<LegacySpResponse> UpdateTurnoAsync(int userRoleId, Turno turno);
    Task<LegacySpResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);
    Task<LegacySpResponse> DeleteTurnoAsync(int userRoleId, int idTurno);
}
