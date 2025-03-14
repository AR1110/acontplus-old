namespace Configuracion.Application.Interfaces;

public interface ITurnoService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> CreateTurnoAsync(int userRoleId, Turno turno);
    Task<LegacyApiResponse> UpdateTurnoAsync(int userRoleId, Turno turno);
    Task<LegacyApiResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);
    Task<LegacyApiResponse> DeleteTurnoAsync(int userRoleId, int idTurno);
}
