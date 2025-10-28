namespace Restaurant.Application.Interfaces;

public interface IStatsService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
}
