namespace Contabilidad.API.Interfaces;

public interface ICuotaPorCobrarService
{
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
