namespace Sales.Api.Endpoints.SuscripcionDetalleEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciondetalles")
            .RequireAuthorization()
            .WithTags("SuscripcionDetalles");

        group.MapGet("/",
                async (string json, ISuscripcionDetalleService suscripcionDetalleService, CancellationToken cancellationToken) =>
                {
                    var result = await suscripcionDetalleService.GetAsync(new Dictionary<string, object>
                        { { "json", SqlStringParam.Sanitize(json) } });
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetSuscripcionDetalles")
            .WithSummary("Get suscripcion detalles")
            .WithDescription("Retrieves suscripcion detalles based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
