namespace Configuration.Api.Endpoints.LicenseEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenses")
            .RequireAuthorization()
            .WithTags("Licenses");

        group.MapDelete("/{id:int}",
                async (int id, ILicenseService licenseService, CancellationToken cancellationToken) =>
                {
                    var result = await licenseService.DeleteAsync(id, cancellationToken);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicense")
            .WithSummary("Delete License")
            .WithDescription("Deletes a License")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
