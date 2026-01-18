namespace Sales.Api.Endpoints.SuscripcionDetalleEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciondetalles")
            .RequireAuthorization()
            .WithTags("SuscripcionDetalles");

        group.MapDelete("/{id:int}",
                async (int id, ISuscripcionDetalleService suscripcionDetalleService, IUserContext userContext) =>
                {
                    var result = await suscripcionDetalleService.DeleteAsync(userContext.GetUserId(), id);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteSuscripcionDetalle")
            .WithSummary("Delete a suscripcion detalle")
            .WithDescription("Deletes a suscripcion detalle by ID")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
