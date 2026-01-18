namespace Identity.Api.Endpoints.LicenciaAccesoEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasacceso")
            .RequireAuthorization()
            .WithTags("LicenciasAcceso");

        group.MapDelete("/{id}",
                async (int id, ILicenciaAccesoService licenciaAccesoService) =>
                {
                    var result = await licenciaAccesoService.DeleteAsync(id);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicenciaAcceso")
            .WithSummary("Delete licencia acceso")
            .WithDescription("Deletes a licencia acceso by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
