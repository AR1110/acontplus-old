using Restaurant.API.Endpoints.MealManagement.MealConsumption;
using Restaurant.API.Endpoints.MealManagement.MealPlan;
using Restaurant.API.Endpoints.MealManagement.MealScheduleSetting;

namespace Restaurant.API.Endpoints.MealManagement;

public static class RegisterMealManagementEndpoints
{
    public static void MapMealManagementEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapMealConsumptionEndpoints();
        app.MapMealPlanEndpoints();
        app.MapMealScheduleSettingEndpoints();
    }
}
