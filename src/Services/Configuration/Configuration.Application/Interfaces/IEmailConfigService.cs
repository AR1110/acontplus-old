namespace Configuration.Application.Interfaces;

public interface IEmailConfigService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
