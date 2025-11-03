namespace Configuration.Application.Interfaces;

public interface IDocConfigService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
}
