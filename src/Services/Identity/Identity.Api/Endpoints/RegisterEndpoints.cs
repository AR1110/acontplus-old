namespace Identity.Api.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllIdentityEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAccountEndpoints();
        app.MapLookupEndpoints();
        app.MapUserProfileEndpoints();
    }
}
