namespace FactElect.API.Interfaces;

public interface INotaCreditoService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
