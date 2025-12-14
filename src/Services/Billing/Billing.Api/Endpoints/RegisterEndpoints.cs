namespace Billing.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapBillingEndpoints();
        app.MapRetencionAtsEndpoints();
        app.MapSriEndpoints();
    }
}
