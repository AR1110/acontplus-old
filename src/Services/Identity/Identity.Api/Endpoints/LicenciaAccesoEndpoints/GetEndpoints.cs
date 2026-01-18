namespace Identity.Api.Endpoints.LicenciaAccesoEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasacceso")
            .RequireAuthorization()
            .WithTags("LicenciasAcceso");

        group.MapGet("/",
                async (string json, ILicenciaAccesoService licenciaAccesoService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", SqlStringParam.Sanitize(json) }
                    };
                    var result = await licenciaAccesoService.GetAsync(parameters);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenciasAcceso")
            .WithSummary("Get licencias acceso")
            .WithDescription("Retrieves licencias acceso based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
