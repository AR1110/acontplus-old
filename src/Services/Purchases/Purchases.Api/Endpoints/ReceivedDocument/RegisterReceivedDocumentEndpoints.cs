namespace Purchases.Api.Endpoints.ReceivedDocument;

public static class RegisterReceivedDocumentEndpoints
{
    public static void MapReceivedDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
