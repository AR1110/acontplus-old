namespace Purchases.Api.Endpoints.ReceivedDocumentDetailTemp;

public static class RegisterReceivedDocumentDetailTempEndpoints
{
    public static void MapReceivedDocumentDetailTempEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCrudEndpoints();
    }
}
