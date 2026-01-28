namespace Billing.Api.Endpoints.ActividadEconomicaEndpoints;

public static class RegisterActividadEconomicaEndpoints
{
    public static void MapActividadEconomicaEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}