namespace Configuracion.API.Interfaces;

public interface ITurnoService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> CreateTurnoAsync(int userRoleId, Turno turno);
    Task<ApiResponseDeprecated> UpdateTurnoAsync(int userRoleId, Turno turno);
    Task<ApiResponseDeprecated> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);
    Task<ApiResponseDeprecated> DeleteTurnoAsync(int userRoleId, int idTurno);
}
