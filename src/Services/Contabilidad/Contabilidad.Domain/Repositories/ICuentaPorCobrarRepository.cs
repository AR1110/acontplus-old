namespace Contabilidad.Domain.Repositories;

public interface ICuentaPorCobrarRepository
{
    // Cuenta
    Task<object> GetAsync(Dictionary<string, object> parameters);

    // Cuota
    Task<SpResponse> UpdateCuotaAsync(Dictionary<string, object> parameters);

    // Garante
    Task<SpResponse> AddGaranteAsync(Dictionary<string, object> parameters);
}
