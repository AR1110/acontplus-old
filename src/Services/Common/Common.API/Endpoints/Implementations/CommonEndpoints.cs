using Common.API.Endpoints.Interfaces;
using Common.AppSettings.Extensions;

namespace Common.API.Endpoints.Implementations;

public class CommonEndpoints(IDashboardService dashboardService, IReleaseService releaseService) : ICommonEndpoints
{
    public async Task<IResult> GetDashboardAsync(HttpContext context)
    {
        var json = context.Request.Query["json"].ToString();
        var userRoleId = context.User.GetUserRoleId();

        var response = await dashboardService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", userRoleId },
            { "json", SqlStringParam.Sanitize(json ?? "") }
        });

        return Results.Ok(response);
    }

    public async Task<IResult> GetReleaseAsync(HttpContext context)
    {
        var userRoleId = context.User.GetUserRoleId();

        return Results.Ok(await releaseService.GetAsync(userRoleId));
    }

    //Add another endpoints
}
