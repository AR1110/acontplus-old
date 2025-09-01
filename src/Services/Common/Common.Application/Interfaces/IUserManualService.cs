namespace Common.Application.Interfaces;

public interface IUserManualService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}