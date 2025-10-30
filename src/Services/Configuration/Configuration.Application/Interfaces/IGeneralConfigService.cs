namespace Configuration.Application.Interfaces;

public interface IGeneralConfigService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
