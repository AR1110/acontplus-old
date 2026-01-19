namespace Configuration.Application.Interfaces;

public interface IUserRoleService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> DeleteAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateStatusAsync(int userId, int id, bool status);
}
