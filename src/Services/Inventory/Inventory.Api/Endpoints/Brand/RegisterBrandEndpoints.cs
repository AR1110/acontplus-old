namespace Inventory.API.Endpoints.Brand;


public static class RegisterBrandEndpoints
{
    public static void MapBrandEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
