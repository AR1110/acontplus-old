namespace Sales.Api.Endpoints.SuscripcionEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suscripciones")
            .RequireAuthorization()
            .WithTags("Suscripciones");

        group.MapPut("/{id:int}",
                async (int id, SuscripcionUpdate request, ISuscripcionService suscripcionService, IUserContext userContext) =>
                {
                    if (id != request.Id)
                        return Results.BadRequest("El id es erroneo");

                    var result = await suscripcionService.UpdateAsync(id, request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateSuscripcion")
            .WithSummary("Update a suscripcion")
            .WithDescription("Updates an existing suscripcion")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}/{estado:bool}",
                async (int id, bool estado, ISuscripcionService suscripcionService, IUserContext userContext) =>
                {
                    var result = await suscripcionService.UpdateStatusAsync(userContext.GetUserId(), id, estado);
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateSuscripcionStatus")
            .WithSummary("Update suscripcion status")
            .WithDescription("Updates the status of a suscripcion")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/Pay/{id:int}/{paid:bool}",
                async (int id, bool paid, ISuscripcionService suscripcionService, IUserContext userContext) =>
                {
                    var result = await suscripcionService.PayAsync(userContext.GetUserId(), id, paid);
                    return result.ToMinimalApiResult();
                })
            .WithName("PaySuscripcion")
            .WithSummary("Pay suscripcion")
            .WithDescription("Updates the payment status of a suscripcion")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
