namespace Configuration.Api.Endpoints.CompanyEndpoints;

public static class CompanyEndpoints
{
    public static void MapCompanyEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/companies")
            .RequireAuthorization()
            .WithTags("Companies");

        MapGetEndpoints(group);
        MapUpdateEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ICompanyService companyService, [AsParameters] CompanySearchRequest request,
                    CancellationToken cancellationToken) =>
                {
                    var parameters = new Dictionary<string, object>();
                    if (!string.IsNullOrEmpty(request.TextSearch))
                        parameters.Add("textSearch", request.TextSearch);
                    if (request.Tipo.HasValue)
                        parameters.Add("tipo", request.Tipo.Value);
                    if (request.UserRoleId.HasValue)
                        parameters.Add("userRoleId", request.UserRoleId.Value);

                    var resp = await companyService.GetAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("GetCompanies")
            .WithSummary("Get companies")
            .WithDescription("Retrieves companies with optional filtering. " +
                           "Use query parameters: textSearch, tipo, userRoleId")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, CompanyUpdate request, ICompanyService companyService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "id", id },
                        { "json", request.SerializeOptimized() }
                    };
                    return Results.Ok(await companyService.UpdateAsync(parameters));
                })
            .WithName("UpdateCompany")
            .WithSummary("Update a company")
            .WithDescription("Updates an existing Company resource.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
