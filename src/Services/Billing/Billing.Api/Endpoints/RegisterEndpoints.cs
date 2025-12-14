namespace Billing.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapBillingEndpoints();
        app.MapLookupEndpoints();
        app.MapRetencionAtsEndpoints();
        app.MapSriEndpoints();
    }
}
