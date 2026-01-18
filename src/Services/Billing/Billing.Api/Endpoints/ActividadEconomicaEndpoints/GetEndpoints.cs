namespace Billing.Api.Endpoints.ActividadEconomicaEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/actividadeseconomicas")
            .RequireAuthorization()
            .WithTags("ActividadesEconomicas");

        group.MapGet("/",
            async (string json, IActividadEconomicaService actividadEconomicaService, IUserContext userContext) =>
                    {
                        var parameters = new Dictionary<string, object>
                        {
                        { "userId", userContext.GetUserId() },
                        { "json", SqlStringParam.Sanitize(json) }
                        };
                        var result = await actividadEconomicaService.GetAsync(parameters);
                        return result.ToGetMinimalApiResult();
                    })
                .WithName("GetActividadesEconomicas")
                .WithSummary("Get actividades economicas")
                .WithDescription("Retrieves actividades economicas based on json parameter")
                .Produces(StatusCodes.Status200OK)
                .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
