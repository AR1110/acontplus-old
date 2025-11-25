using Restaurant.API.Endpoints.Item;
using Restaurant.API.Endpoints.MealManagement;
using Restaurant.API.Endpoints.Promotion;
using Restaurant.API.Endpoints.Order;

namespace Restaurant.API.Endpoints;

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
