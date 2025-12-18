namespace Purchases.Api.Endpoints.PurchaseInvoice;

public static class RegisterPurchaseInvoiceEndpoints
{
    public static void MapPurchaseInvoiceEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
