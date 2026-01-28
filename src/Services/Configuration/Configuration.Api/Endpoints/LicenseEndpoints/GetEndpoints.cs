namespace Configuration.Api.Endpoints.LicenseEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenses")
            .RequireAuthorization()
            .WithTags("Licenses");

        group.MapGet("/",
                async (ILicenseService licenseService, CancellationToken cancellationToken) =>
                {
                    var result = await licenseService.GetAllAsync(cancellationToken);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenses")
            .WithSummary("Get Licenses")
            .WithDescription("Retrieves all licenses")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, ILicenseService licenseService, CancellationToken cancellationToken) =>
                {
                    var result = await licenseService.GetByIdAsync(id, cancellationToken);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenseById")
            .WithSummary("Get License by ID")
            .WithDescription("Retrieves access license by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
