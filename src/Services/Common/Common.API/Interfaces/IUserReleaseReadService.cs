namespace Common.API.Interfaces;

public interface IUserReleaseReadService
{
    Task<ApiResponse> AddAsync(ApiRequest apiRequest);
}