namespace Configuration.Application.Interfaces;

public interface ICompanyService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
