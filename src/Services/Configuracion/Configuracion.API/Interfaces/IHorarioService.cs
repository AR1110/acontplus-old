namespace Configuracion.API.Interfaces;

public interface IHorarioService
{
    Task<ApiResponse> GetAsync(int userRoleId, int turnoId);
    Task<ApiResponse> GetDaysAsync();
}
