namespace Billing.Api.Endpoints.ActividadEconomicaEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/actividadeseconomicas")
            .RequireAuthorization()
            .WithTags("ActividadesEconomicas");

        group.MapPut("/{id:int}",
            async (int id, ActividadEconomica actividadEconomica, IActividadEconomicaService actividadEconomicaService, IUserContext userContext) =>
                    {
                        var parameters = new Dictionary<string, object>
                        {
                        { "userId", userContext.GetUserId() },
                        { "id", id },
                        { "json", DataConverters.SerializeObjectCustom<ActividadEconomica>(actividadEconomica) }
                        };
                        var result = await actividadEconomicaService.UpdateAsync(parameters);
                        return result.ToMinimalApiResult();
                    })
                .WithName("UpdateActividadEconomica")
                .WithSummary("Update an actividad economica")
                .WithDescription("Updates an existing actividad economica")
                .Produces(StatusCodes.Status200OK)
                .ProducesProblem(StatusCodes.Status400BadRequest)
                .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
