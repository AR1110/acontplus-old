namespace FactElect.API.Interfaces
{
    public interface IRetencionAtsService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
