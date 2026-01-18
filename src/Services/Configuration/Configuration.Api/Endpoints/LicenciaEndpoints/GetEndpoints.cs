namespace Configuration.Api.Endpoints.LicenciaEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licencias")
            .RequireAuthorization()
            .WithTags("Licencias");

        group.MapGet("/",
                async (ILicenciaService licenciaService, CancellationToken cancellationToken) =>
                {
                    return await licenciaService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllLicencias")
            .WithSummary("Get all licencias")
            .WithDescription("Retrieves a list of all Licencia resources.")
            .Produces<IReadOnlyList<LicenciaItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, ILicenciaService licenciaService, CancellationToken cancellationToken) =>
                {
                    return await licenciaService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetLicenciaById")
            .WithSummary("Get a licencia by ID")
            .WithDescription("Retrieves a single Licencia resource by its unique identifier.")
            .Produces<LicenciaItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}


