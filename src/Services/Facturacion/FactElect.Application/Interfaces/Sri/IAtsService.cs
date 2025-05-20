namespace FactElect.Application.Interfaces.Sri;

public interface IAtsService
{
    Task<ApiResponse> CheckValidationAsync(Dictionary<string, object> parameters);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters);
}