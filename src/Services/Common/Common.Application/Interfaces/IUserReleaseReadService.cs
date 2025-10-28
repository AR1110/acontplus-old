namespace Common.Application.Interfaces;

public interface IUserReleaseReadService
{
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
}
