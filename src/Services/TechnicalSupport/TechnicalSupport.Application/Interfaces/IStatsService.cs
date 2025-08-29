namespace TechnicalSupport.Application.Interfaces;

public interface IStatsService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}