namespace Restaurant.Api.Endpoints.Order;

public static class RegisterOrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        CancelEndpoints.MapCancelEndpoints(app);
        CreateEndpoints.MapCreateEndpoints(app);
        GetEndpoints.MapGetEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }
}
