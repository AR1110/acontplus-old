namespace Sales.Api.Endpoints.SuscripcionEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciones")
            .RequireAuthorization()
            .WithTags("Suscripciones");

        group.MapPost("/",
                async (SuscripcionCreate request, ISuscripcionService suscripcionService, IUserContext userContext) =>
                {
                    var result = await suscripcionService.AddAsync(request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateSuscripcion")
            .WithSummary("Create a suscripcion")
            .WithDescription("Creates a new suscripcion")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
