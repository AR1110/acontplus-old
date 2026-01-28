namespace Configuration.Api.Endpoints.EmailSenderConfigEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/email-sender-configs")
            .RequireAuthorization()
            .WithTags("Email Sender Configurations");

        group.MapPut("/{id:int}",
                async (int id, EmailSenderConfigUpdate request, IEmailSenderConfigService emailSenderConfigService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await emailSenderConfigService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateEmailSenderConfig")
            .WithSummary("Update an email sender configuration")
            .WithDescription("Updates an existing email sender configuration resource by its unique identifier.")
            .Produces<EmailSenderConfigItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
