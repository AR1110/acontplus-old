namespace Configuration.Api.Endpoints.LicenseTypeEndpoints;

public static class LicenseTypeEndpoints
{
    public static void MapLicenseTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/license-types")
            .RequireAuthorization()
            .WithTags("License Types");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ILicenseTypeService licenseTypeService, CancellationToken cancellationToken) =>
                {
                    return await licenseTypeService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllLicenseTypes")
            .WithSummary("Get all license types")
            .WithDescription("Retrieves a list of all LicenseType resources.")
            .Produces<IReadOnlyList<LicenseTypeItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, ILicenseTypeService licenseTypeService, CancellationToken cancellationToken) =>
                {
                    return await licenseTypeService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetLicenseTypeById")
            .WithSummary("Get a license type by ID")
            .WithDescription("Retrieves a single LicenseType resource by its unique identifier.")
            .Produces<LicenseTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Test endpoint to check if API is working
        group.MapGet("/test",
                () =>
                {
                    return Result<object, DomainError>.Success(new { message = "LicenseType API is working", timestamp = DateTime.UtcNow }).ToGetMinimalApiResult();
                })
            .WithName("TestLicenseTypeApi")
            .WithSummary("Test endpoint")
            .WithDescription("Simple test endpoint to verify API is working.")
            .AllowAnonymous();
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
            async (LicenseTypeCreate request, ILicenseTypeService licenseTypeService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await licenseTypeService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateLicenseType")
            .WithSummary("Create a new license type")
            .WithDescription("Creates a new LicenseType resource. The code must be unique.")
            .Produces<LicenseTypeItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
            async (int id, LicenseTypeUpdate request, ILicenseTypeService licenseTypeService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await licenseTypeService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateLicenseType")
            .WithSummary("Update an existing license type")
            .WithDescription("Updates an existing LicenseType resource. The code must be unique.")
            .Produces<LicenseTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ILicenseTypeService licenseTypeService, CancellationToken cancellationToken) =>
                {
                    return await licenseTypeService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteLicenseType")
            .WithSummary("Delete a license type")
            .WithDescription("Deletes a LicenseType resource by its unique identifier.")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
