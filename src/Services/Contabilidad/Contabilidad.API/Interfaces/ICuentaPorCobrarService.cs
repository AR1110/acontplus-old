namespace Contabilidad.API.Interfaces;

public interface ICuentaPorCobrarService
{
    // Cuenta
    Task<object> GetAsync(Dictionary<string, object> parameters);

    // Cuota
    Task<ApiResponse> UpdateCuotaAsync(Dictionary<string, object> parameters);

    // Garante
    Task<ApiResponse> AddGaranteAsync(Dictionary<string, object> parameters);
}
