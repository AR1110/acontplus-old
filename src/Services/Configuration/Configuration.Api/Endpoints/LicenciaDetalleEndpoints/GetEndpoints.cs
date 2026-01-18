namespace Configuration.Api.Endpoints.LicenciaDetalleEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciadetalle")
            .RequireAuthorization()
            .WithTags("LicenciaDetalle");

        group.MapGet("/",
                async (string json, ILicenciaDetalleService licenciaDetalleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "json", SqlStringParam.Sanitize(json) }
                    };
                    return await licenciaDetalleService.GetAsync(parameters).ToGetMinimalApiResultAsync();
                })
            .WithName("GetLicenciaDetalle")
            .WithSummary("Get licencia detalle")
            .WithDescription("Retrieves licencia detalle data")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
