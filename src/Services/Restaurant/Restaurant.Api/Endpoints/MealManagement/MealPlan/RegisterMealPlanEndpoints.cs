namespace Restaurant.Api.Endpoints.MealManagement.MealPlan;

public static class RegisterMealPlanEndpoints
{
    public static void MapMealPlanEndpoints(this IEndpointRouteBuilder app)
    {
        CreateEndpoints.MapCreateEndpoints(app);
        GetEndpoints.MapGetEndpoints(app);
        DeleteEndpoints.MapDeleteEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }
}
