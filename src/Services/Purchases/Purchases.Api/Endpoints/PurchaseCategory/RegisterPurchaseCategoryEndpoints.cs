namespace Purchases.Api.Endpoints.PurchaseCategory;

public static class RegisterPurchaseCategoryEndpoints
{
    public static void MapPurchaseCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
