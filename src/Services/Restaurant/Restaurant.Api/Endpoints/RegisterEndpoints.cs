using Restaurant.Api.Endpoints.Item;
using Restaurant.Api.Endpoints.MealManagement;
using Restaurant.Api.Endpoints.Promotion;
using Restaurant.Api.Endpoints.Order;

namespace Restaurant.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMealManagementEndpoints();
        app.MapItemEndpoints();
        app.MapLookupEndpoints();
        app.MapPromotionEndpoints();
        app.MapOrderEndpoints();
    }
}
