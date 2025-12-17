namespace Purchases.Api.Endpoints.HabitualPurchase;

public static class RegisterHabitualPurchaseEndpoints
{
  public static void MapHabitualPurchaseEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapCrudEndpoints();
  }
}
