using Sales.Api.Endpoints.SubscriptionEndpoints;

namespace Sales.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapLookupEndpoints();
        app.MapSubscriptionEndpoints();
    }
}
