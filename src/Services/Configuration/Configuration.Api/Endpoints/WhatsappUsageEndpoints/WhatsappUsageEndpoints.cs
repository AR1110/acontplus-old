namespace Configuration.Api.Endpoints.WhatsappUsageEndpoints;

public static class WhatsappUsageEndpoints
{
    public static void MapWhatsappUsageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/whatsapp-usages")
            .RequireAuthorization()
            .WithTags("WhatsApp Usage");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IWhatsappUsageService whatsappUsageService, CancellationToken cancellationToken) =>
                {
                    return await whatsappUsageService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllWhatsAppUsages")
            .WithSummary("Get all WhatsApp usage entries")
            .WithDescription("Retrieves a list of all WhatsApp usage resources.")
            .Produces<IReadOnlyList<WhatsAppUsageItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IWhatsappUsageService whatsappUsageService, CancellationToken cancellationToken) =>
                {
                    return await whatsappUsageService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetWhatsAppUsageById")
            .WithSummary("Get a WhatsApp usage entry by ID")
            .WithDescription("Retrieves a single WhatsApp usage resource by its unique identifier.")
            .Produces<WhatsAppUsageItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/by-company-id/{companyId:int}",
                async (int companyId, IWhatsappUsageService whatsappUsageService,
                    CancellationToken cancellationToken) =>
                {
                    return await whatsappUsageService.GetByCompanyIdAsync(companyId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("GetWhatsAppUsageByCompanyId")
            .WithSummary("Get a WhatsApp usage entry by CompanyId")
            .WithDescription("Retrieves a single WhatsApp usage resource by its unique company identifier.")
            .Produces<WhatsAppUsageItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (WhatsAppUsageItem WhatsAppUsageItem, IWhatsappUsageService whatsappUsageService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    WhatsAppUsageItem.CreatedByUserId = userContext.GetUserId();
                    return await whatsappUsageService.AddAsync(WhatsAppUsageItem, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateWhatsAppUsage")
            .WithSummary("Create a new WhatsApp usage entry")
            .WithDescription("Creates a new WhatsApp usage resource.")
            .Produces<ApiResponse<WhatsAppUsageItem>>(201)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, WhatsAppUsageItem WhatsAppUsageItem, IWhatsappUsageService whatsappUsageService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    WhatsAppUsageItem.UpdatedByUserId = userContext.GetUserId();
                    return await whatsappUsageService.UpdateAsync(id, WhatsAppUsageItem, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateWhatsAppUsage")
            .WithSummary("Update a WhatsApp usage entry by ID")
            .WithDescription("Updates an existing WhatsApp usage resource by its unique identifier.")
            .Produces<ApiResponse<WhatsAppUsageItem>>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IWhatsappUsageService whatsappUsageService, CancellationToken cancellationToken) =>
                {
                    return await whatsappUsageService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteWhatsAppUsage")
            .WithSummary("Delete a WhatsApp usage entry by ID")
            .WithDescription("Deletes an existing WhatsApp usage resource by its unique identifier.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
