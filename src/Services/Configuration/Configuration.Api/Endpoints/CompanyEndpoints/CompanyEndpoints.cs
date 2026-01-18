namespace Configuration.Api.Endpoints.CompanyEndpoints;

public static class CompanyEndpoints
{
    public static void MapCompanyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/companies")
            .RequireAuthorization()
            .WithTags("Companies");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ICompanyService companyService, PaginationQuery paginationQuery,
                    CancellationToken cancellationToken) =>
                {
                    var PaginationRequest = paginationQuery.Adapt<PaginationRequest>() with
                    {
                        SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
                    };

                    return await companyService.GetAsync(PaginationRequest, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetCompanies")
            .WithSummary("Get companies")
            .WithDescription("Retrieves companies with optional filtering, pagination, and sorting. " +
                           "Use query parameters: searchTerm, pageIndex, pageSize, sortBy, sortDirection, filters")
            .Produces<PagedResult<CompanyItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        // NOTE: Search endpoint removed. Use /paged with PaginationQuery.searchTerm instead.
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (CompanyCreate request, ICompanyService companyService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var requestWithUser = request with { CreatedByUserId = userContext.GetUserId() };
                    return await companyService.AddAsync(requestWithUser, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateCompany")
            .WithSummary("Create a new company")
            .WithDescription("Creates a new Company resource.")
            .Produces<CompanyCreatedResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, CompanyUpdate request, ICompanyService companyService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var requestWithUser = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await companyService.UpdateAsync(id, requestWithUser, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateCompany")
            .WithSummary("Update a company")
            .WithDescription("Updates an existing Company resource.")
            .Produces<CompanyItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}/status/{isActive:bool}",
                async (int id, bool isActive, ICompanyService companyService, CancellationToken cancellationToken) =>
                {
                    return await companyService.UpdateStatusAsync(id, isActive, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateCompanyStatus")
            .WithSummary("Update company status")
            .WithDescription("Updates the active status of a company.")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ICompanyService companyService, CancellationToken cancellationToken) =>
                {
                    return await companyService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteCompany")
            .WithSummary("Delete a company")
            .WithDescription("Soft deletes a company by setting IsDeleted to true.")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
