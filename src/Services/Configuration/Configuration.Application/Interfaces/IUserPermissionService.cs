namespace Configuration.Application.Interfaces;

public interface IUserPermissionService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
}
