namespace Sales.Api.Endpoints.SuscripcionEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciones")
            .RequireAuthorization()
            .WithTags("Suscripciones");

        group.MapDelete("/{id:int}",
                async (int id, ISuscripcionService suscripcionService, IUserContext userContext) =>
                {
                    var result = await suscripcionService.DeleteAsync(id, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteSuscripcion")
            .WithSummary("Delete a suscripcion")
            .WithDescription("Deletes a suscripcion by ID")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
