namespace Restaurant.API.Endpoints.Promotion;

public static class RegisterPromotionEndpoints
{
    public static void MapPromotionEndpoints(this IEndpointRouteBuilder app)
    {
        CreateEndpoints.MapCreateEndpoints(app);
        GetEndpoints.MapGetEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }

}
