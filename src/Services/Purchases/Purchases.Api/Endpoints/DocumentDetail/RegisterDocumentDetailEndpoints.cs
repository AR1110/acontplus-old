namespace Purchases.Api.Endpoints.DocumentDetail;

public static class RegisterDocumentDetailEndpoints
{
    public static void MapDocumentDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCrudEndpoints();
    }
}
