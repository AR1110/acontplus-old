namespace Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

public static class RegisterMealScheduleSettingEndpoints
{
    public static void MapMealScheduleSettingEndpoints(this IEndpointRouteBuilder app)
    {
        CreateEndpoints.MapCreateEndpoints(app);
        GetEndpoints.MapGetEndpoints(app);
        DeleteEndpoints.MapDeleteEndpoints(app);
        UpdateEndpoints.MapUpdateEndpoints(app);
    }
}
