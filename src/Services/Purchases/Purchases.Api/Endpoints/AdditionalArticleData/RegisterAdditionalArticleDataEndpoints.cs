namespace Purchases.Api.Endpoints.AdditionalArticleData;

public static class RegisterAdditionalArticleDataEndpoints
{
    public static void MapAdditionalArticleDataEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCrudEndpoints();
    }
}
