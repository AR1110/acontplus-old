namespace Configuration.Api.Endpoints.EmailSenderConfigEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/email-sender-configs")
            .RequireAuthorization()
            .WithTags("Email Sender Configurations");

        group.MapGet("/",
                async (IEmailSenderConfigService emailSenderConfigService,
                    CancellationToken cancellationToken = default) =>
                {
                    return await emailSenderConfigService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllEmailSenderConfigs")
            .WithSummary("Get all email sender configurations")
            .WithDescription("Retrieves a list of all email sender configuration resources with optional filtering.")
            .Produces<IReadOnlyList<EmailSenderConfigItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IEmailSenderConfigService emailSenderConfigService, CancellationToken cancellationToken) =>
                {
                    return await emailSenderConfigService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetEmailSenderConfigById")
            .WithSummary("Get an email sender configuration by ID")
            .WithDescription("Retrieves a single email sender configuration resource by its unique identifier.")
            .Produces<EmailSenderConfigItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
