namespace Common.Application.Interfaces;

public interface IUserReleaseReadService
{
    Task<ApiResponse> AddAsync(ApiRequest apiRequest);
}