namespace Contabilidad.API.Interfaces
{
    public interface IComprobanteIngresoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters); 
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters); 
     
    }
}
