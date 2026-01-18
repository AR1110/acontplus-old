namespace Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasaccesodetalle")
            .RequireAuthorization()
            .WithTags("LicenciasAccesoDetalle");

        group.MapGet("/",
                async (string json, ILicenciaAccesoDetalleService licenciaAccesoDetalleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", SqlStringParam.Sanitize(json) }
                    };
                    var result = await licenciaAccesoDetalleService.GetAsync(parameters);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenciasAccesoDetalle")
            .WithSummary("Get licencias acceso detalle")
            .WithDescription("Retrieves licencias acceso detalle based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
