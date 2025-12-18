using Purchases.Api.Endpoints.AdditionalArticleData;
using Purchases.Api.Endpoints.Article;
using Purchases.Api.Endpoints.DocumentDetail;
using Purchases.Api.Endpoints.HabitualPurchase;
using Purchases.Api.Endpoints.NonHabitualPurchase;
using Purchases.Api.Endpoints.PurchaseCategory;
using Purchases.Api.Endpoints.PurchaseInvoice;
using Purchases.Api.Endpoints.PurchaseOrder;
using Purchases.Api.Endpoints.ReceivedDocument;
using Purchases.Api.Endpoints.ReceivedDocumentDetailTemp;
using Purchases.Api.Endpoints.Supplier;

namespace Purchases.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapLookupEndpoints();
        app.MapPurchaseOrderEndpoints();
        app.MapSupplierEndpoints();
        app.MapArticleEndpoints();
        app.MapPurchaseInvoiceEndpoints();
        app.MapReceivedDocumentEndpoints();
        app.MapPurchaseCategoryEndpoints();
        app.MapHabitualPurchaseEndpoints();
        app.MapNonHabitualPurchaseEndpoints();
        app.MapAdditionalArticleDataEndpoints();
        app.MapDocumentDetailEndpoints();
        app.MapReceivedDocumentDetailTempEndpoints();
    }
}
