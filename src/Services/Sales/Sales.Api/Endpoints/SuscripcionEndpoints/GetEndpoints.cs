namespace Sales.Api.Endpoints.SuscripcionEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciones")
            .RequireAuthorization()
            .WithTags("Suscripciones");

        group.MapGet("/",
                async (string json, ISuscripcionService suscripcionService, CancellationToken cancellationToken) =>
                {
                    var result = await suscripcionService.GetAsync(new Dictionary<string, object>
                        { { "json", SqlStringParam.Sanitize(json) } });
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetSuscripciones")
            .WithSummary("Get suscripciones")
            .WithDescription("Retrieves suscripciones based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, ISuscripcionService suscripcionService, CancellationToken cancellationToken) =>
                {
                    var result = await suscripcionService.GetByIdAsync(id);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetSuscripcionById")
            .WithSummary("Get suscripcion by ID")
            .WithDescription("Retrieves a specific suscripcion by its ID")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
