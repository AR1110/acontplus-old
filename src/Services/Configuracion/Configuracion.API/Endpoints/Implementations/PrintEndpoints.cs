using Configuracion.API.Endpoints.Interfaces;

namespace Configuracion.API.Endpoints.Implementations;

public class PrintEndpoints(
    IPrintService printService,
    IUserContext userContext,
    IHttpContextAccessor httpContextAccessor) : IPrintEndpoints
{
    public async Task<IResult> Print(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) },
            { "isMobileUserAgent", httpContextAccessor.HttpContext!.Items["IsMobileUserAgent"] ?? "false" }
        };
        var response = await printService.GetAsync(parameters);
        if (response == null || string.IsNullOrEmpty(response)) { return Results.BadRequest(); }

        return Results.Ok(response);
    }
}
