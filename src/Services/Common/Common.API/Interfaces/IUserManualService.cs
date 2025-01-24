namespace Common.API.Interfaces;

public interface IUserManualService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
