namespace Mechanical.Application.Interfaces;

public interface IInspectionService
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
}
