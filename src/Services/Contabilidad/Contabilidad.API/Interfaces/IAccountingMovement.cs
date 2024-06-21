namespace Contabilidad.API.Interfaces
{
    public interface IAccountingMovement
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
