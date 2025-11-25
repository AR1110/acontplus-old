namespace Configuration.Api.Endpoints.PrintEndpoints;

public static class RegisterPrintEndpoints
{
    public static void MapPrintEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
    }
}
