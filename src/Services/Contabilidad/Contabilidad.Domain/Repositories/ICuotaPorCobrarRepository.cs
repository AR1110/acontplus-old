namespace Contabilidad.Domain.Repositories;

public interface ICuotaPorCobrarRepository
{
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
