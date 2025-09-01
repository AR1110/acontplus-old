namespace Common.Application.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}