namespace Contabilidad.API.Interfaces;

public interface IAccountingMovementService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}