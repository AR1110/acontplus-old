namespace Purchases.Api.Endpoints.PurchaseOrder;

public static class RegisterPurchaseOrderEndpoints
{
  public static void MapPurchaseOrderEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapGetEndpoints();
    app.MapCreateEndpoints();
    app.MapUpdateEndpoints();
    app.MapDeleteEndpoints();
  }
}
