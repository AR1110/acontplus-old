namespace Configuration.Api.Endpoints.EmailSenderConfigEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/email-sender-configs")
            .RequireAuthorization()
            .WithTags("Email Sender Configurations");

        group.MapDelete("/{id:int}",
                async (int id, IEmailSenderConfigService emailSenderConfigService, CancellationToken cancellationToken) =>
                {
                    return await emailSenderConfigService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteEmailSenderConfig")
            .WithSummary("Delete an email sender configuration")
            .WithDescription("Deletes an email sender configuration resource by its unique identifier.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
