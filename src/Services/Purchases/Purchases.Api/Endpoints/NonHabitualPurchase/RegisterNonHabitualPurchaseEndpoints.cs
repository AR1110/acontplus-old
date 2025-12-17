namespace Purchases.Api.Endpoints.NonHabitualPurchase;

public static class RegisterNonHabitualPurchaseEndpoints
{
  public static void MapNonHabitualPurchaseEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapCrudEndpoints();
  }
}
