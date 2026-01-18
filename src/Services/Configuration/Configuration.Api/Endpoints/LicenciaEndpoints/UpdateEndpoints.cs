namespace Configuration.Api.Endpoints.LicenciaEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licencias")
            .RequireAuthorization()
            .WithTags("Licencias");

        group.MapPut("/{id:int}",
                async (int id, LicenciaUpdate request, ILicenciaService licenciaService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await licenciaService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateLicencia")
            .WithSummary("Update licencia")
            .WithDescription("Updates an existing Licencia resource")
            .Produces<LicenciaUpdate>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}


