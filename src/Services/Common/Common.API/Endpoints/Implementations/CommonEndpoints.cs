using Common.API.Endpoints.Interfaces;

namespace Common.API.Endpoints.Implementations;

public class CommonEndpoints(IDashboardService dashboardService, IReleaseService releaseService, IUserContext userContext) : ICommonEndpoints
{
    private const string UserRoleClaimType = "userRoleId";
    public async Task<IResult> GetDashboardAsync(string json)
    {
        var response = await dashboardService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json ?? "") }
        });

        return Results.Ok(response);
    }

    public async Task<IResult> GetReleaseAsync()
    {
        return Results.Ok(await releaseService.GetAsync(userContext.GetClaimValue<int>(UserRoleClaimType)));
    }

    //Add another endpoints
}
