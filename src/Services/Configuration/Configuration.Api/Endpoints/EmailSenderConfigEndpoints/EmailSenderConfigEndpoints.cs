namespace Configuration.Api.Endpoints.EmailSenderConfigEndpoints;

public static class EmailSenderConfigEndpoints
{
    public static void MapEmailSenderConfigEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateEndpoints();
        app.MapGetEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
