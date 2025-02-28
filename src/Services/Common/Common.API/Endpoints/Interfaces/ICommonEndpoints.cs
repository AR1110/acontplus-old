namespace Common.API.Endpoints.Interfaces;

public interface ICommonEndpoints
{
    Task<IResult> GetDashboardAsync(string json);
    Task<IResult> GetReleaseAsync();
}
