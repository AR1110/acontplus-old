namespace Configuration.Api.Endpoints.LicenciaEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licencias")
            .RequireAuthorization()
            .WithTags("Licencias");

        group.MapDelete("/{id:int}",
                async (int id, ILicenciaService licenciaService, CancellationToken cancellationToken) =>
                {
                    return await licenciaService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteLicencia")
            .WithSummary("Delete licencia")
            .WithDescription("Deletes an existing Licencia resource")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}


