using Inventory.API.Endpoints.Brand;
using Inventory.API.Endpoints.Model;

namespace Inventory.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapLookupEndpoints();
        app.MapBrandEndpoints();
        app.MapModelEndpoints();
    }
}
