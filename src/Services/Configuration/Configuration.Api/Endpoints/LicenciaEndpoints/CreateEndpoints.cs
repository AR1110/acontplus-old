namespace Configuration.Api.Endpoints.LicenciaEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licencias")
            .RequireAuthorization()
            .WithTags("Licencias");

        group.MapPost("/",
                async (LicenciaCreate request, ILicenciaService licenciaService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await licenciaService.AddAsync(request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateLicencia")
            .WithSummary("Create a new licencia")
            .WithDescription("Creates a new Licencia resource.")
            .Produces<LicenciaCreate>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}


