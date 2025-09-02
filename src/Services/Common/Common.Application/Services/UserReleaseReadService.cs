namespace Common.Application.Services;

public class UserReleaseReadService(IAdoRepository adoRepository) : IUserReleaseReadService
{
    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.SpExecuteAsync<ApiResponse>("Common.UserReleaseRead_Insert", parameters);
}
