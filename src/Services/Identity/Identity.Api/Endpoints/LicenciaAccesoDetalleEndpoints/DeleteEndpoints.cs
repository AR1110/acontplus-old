namespace Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasaccesodetalle")
            .RequireAuthorization()
            .WithTags("LicenciasAccesoDetalle");

        group.MapDelete("/{id}",
                async (int id, ILicenciaAccesoDetalleService licenciaAccesoDetalleService) =>
                {
                    var result = await licenciaAccesoDetalleService.DeleteAsync(id);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicenciaAccesoDetalle")
            .WithSummary("Delete licencia acceso detalle")
            .WithDescription("Deletes a licencia acceso detalle by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
