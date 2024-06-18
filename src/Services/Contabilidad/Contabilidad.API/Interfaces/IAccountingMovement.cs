namespace Contabilidad.API.Interfaces
{
    public class IAccountingMovement
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
