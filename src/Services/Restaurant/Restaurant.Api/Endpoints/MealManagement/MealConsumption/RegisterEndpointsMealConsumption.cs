namespace Restaurant.Api.Endpoints.MealManagement.MealConsumption;

public static class RegisterEndpointsMealConsumption
{
    public static void MapMealConsumptionEndpoints(this IEndpointRouteBuilder app)
    {
        CreateEndpoints.MapCreateEndpoints(app);
        GetEndpoints.MapGetEndpoints(app);
        DeleteEndpoints.MapDeleteEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }
}
