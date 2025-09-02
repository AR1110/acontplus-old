namespace Common.Application.Interfaces;

public interface IUserReleaseReadService
{
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
}
