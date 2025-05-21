namespace Common.API.Interfaces;

public interface IReleaseService
{
    Task<ApiResponse> GetAsync(int userRoleId);
}