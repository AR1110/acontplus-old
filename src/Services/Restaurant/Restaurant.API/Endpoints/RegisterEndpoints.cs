using Restaurant.API.Endpoints.MealManagement;

namespace Restaurant.API.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMealManagementEndpoints();
    }
}

