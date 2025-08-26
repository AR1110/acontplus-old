namespace Contabilidad.Domain.Repositories;

public interface ICuentaPorCobrarRepository
{
    // Cuenta
    Task<object> GetAsync(Dictionary<string, object> parameters);

    // Cuota
    Task<ApiResponse> UpdateCuotaAsync(Dictionary<string, object> parameters);

    // Garante
    Task<ApiResponse> AddGaranteAsync(Dictionary<string, object> parameters);
}