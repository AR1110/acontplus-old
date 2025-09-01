namespace Common.Application.Interfaces;

public interface IReleaseService
{
    Task<ApiResponse> GetAsync(int userRoleId);
}