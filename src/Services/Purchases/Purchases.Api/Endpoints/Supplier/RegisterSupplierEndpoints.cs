namespace Purchases.Api.Endpoints.Supplier;

public static class RegisterSupplierEndpoints
{
  public static void MapSupplierEndpoints(this IEndpointRouteBuilder app)
  {
    app.MapGetEndpoints();
    app.MapCreateEndpoints();
    app.MapUpdateEndpoints();
    app.MapDeleteEndpoints();
  }
}
