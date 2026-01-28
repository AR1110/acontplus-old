namespace Billing.Api.Endpoints.ActividadEconomicaEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/actividadeseconomicas")
            .RequireAuthorization()
            .WithTags("ActividadesEconomicas");

        group.MapDelete("/{id:int}",
            async (int id, IActividadEconomicaService actividadEconomicaService, IUserContext userContext) =>
                    {
                        var parameters = new Dictionary<string, object>
                        {
                        { "userId", userContext.GetUserId() },
                        { "id", id }
                        };
                        var result = await actividadEconomicaService.DeleteAsync(parameters);
                        return result.ToMinimalApiResult();
                    })
                .WithName("DeleteActividadEconomica")
                .WithSummary("Delete an actividad economica")
                .WithDescription("Deletes an actividad economica by ID")
                .Produces(StatusCodes.Status200OK)
                .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
