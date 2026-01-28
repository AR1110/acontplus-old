namespace Configuration.Api.Endpoints.EmailSenderConfigEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/email-sender-configs")
            .RequireAuthorization()
            .WithTags("Email Sender Configurations");

        group.MapPost("/",
                async (EmailSenderConfigCreate request, IEmailSenderConfigService emailSenderConfigService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    // Set the user ID for audit purposes
                    var requestWithUser = request with { };

                    return await emailSenderConfigService.AddAsync(requestWithUser, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateEmailSenderConfig")
            .WithSummary("Create a new email sender configuration")
            .WithDescription("Creates a new email sender configuration resource. The configuration must be unique per company.")
            .Produces<EmailSenderConfigItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
