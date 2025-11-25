using Restaurant.Api.Endpoints.MealManagement.MealConsumption;
using Restaurant.Api.Endpoints.MealManagement.MealPlan;
using Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

namespace Restaurant.Api.Endpoints.MealManagement;

public static class RegisterMealManagementEndpoints
{
    public static void MapMealManagementEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMealConsumptionEndpoints();
        app.MapMealPlanEndpoints();
        app.MapMealScheduleSettingEndpoints();
    }
}
