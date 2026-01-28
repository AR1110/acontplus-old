using Billing.Api.Endpoints.ActividadEconomicaEndpoints;

namespace Billing.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapActividadEconomicaEndpoints();
        app.MapBillingEndpoints();
        app.MapLookupEndpoints();
        app.MapRetencionAtsEndpoints();
        app.MapSriEndpoints();
    }
}
