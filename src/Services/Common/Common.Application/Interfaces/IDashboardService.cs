namespace Common.Application.Interfaces;

public interface IDashboardService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
