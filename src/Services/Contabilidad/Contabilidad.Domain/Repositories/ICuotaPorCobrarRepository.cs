namespace Contabilidad.Domain.Repositories;

public interface ICuotaPorCobrarRepository
{
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
