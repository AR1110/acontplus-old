namespace Common.API.Endpoints.Interfaces;

public interface ICommonEndpoints
{
    Task<IResult> GetDashboardAsync(HttpContext context);
    Task<IResult> GetReleaseAsync(HttpContext context);
}
