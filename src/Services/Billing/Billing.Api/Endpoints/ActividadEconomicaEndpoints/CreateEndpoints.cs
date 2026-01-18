namespace Billing.Api.Endpoints.ActividadEconomicaEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/actividadeseconomicas")
            .RequireAuthorization()
            .WithTags("ActividadesEconomicas");

        group.MapPost("/",
            async (ActividadEconomica actividadEconomica, IActividadEconomicaService actividadEconomicaService, IUserContext userContext) =>
                    {
                        var parameters = new Dictionary<string, object>
                        {
                        { "userId", userContext.GetUserId() },
                        { "json", DataConverters.SerializeObjectCustom<ActividadEconomica>(actividadEconomica) }
                        };
                        var result = await actividadEconomicaService.AddAsync(parameters);
                        return result.ToMinimalApiResult();
                    })
                .WithName("CreateActividadEconomica")
                .WithSummary("Create an actividad economica")
                .WithDescription("Creates a new actividad economica")
                .Produces(StatusCodes.Status201Created)
                .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
