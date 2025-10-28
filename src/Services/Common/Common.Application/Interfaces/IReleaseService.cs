namespace Common.Application.Interfaces;

public interface IReleaseService
{
    Task<SpResponse> GetAsync(int userRoleId);
}
