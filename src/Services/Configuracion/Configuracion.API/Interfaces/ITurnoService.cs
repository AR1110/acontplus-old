namespace Configuracion.API.Interfaces;

public interface ITurnoService
{
    Task<string> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> CreateTurnoAsync(int userRoleId, Turno turno);
    Task<ApiResponse> UpdateTurnoAsync(int userRoleId, Turno turno);
    Task<ApiResponse> ReadTurnoAsync(int userRoleId, int pageIndex, int pageSize);
    Task<ApiResponse> DeleteTurnoAsync(int userRoleId, int idTurno);
}
