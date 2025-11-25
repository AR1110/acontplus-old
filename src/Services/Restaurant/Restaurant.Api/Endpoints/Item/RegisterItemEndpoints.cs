namespace Restaurant.Api.Endpoints.Item;

public static class RegisterItemEndpoints
{
    public static void MapItemEndpoints(this IEndpointRouteBuilder app)
    {
        GetEndpoints.MapGetEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }
}
