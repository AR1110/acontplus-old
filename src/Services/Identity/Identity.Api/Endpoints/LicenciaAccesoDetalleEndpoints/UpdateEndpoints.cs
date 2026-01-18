namespace Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasaccesodetalle")
            .RequireAuthorization()
            .WithTags("LicenciasAccesoDetalle");

        group.MapPut("/{id}",
                async (int id, LicenciaAccesoDetalleUpdate request, ILicenciaAccesoDetalleService licenciaAccesoDetalleService, IUserContext userContext) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    var result = await licenciaAccesoDetalleService.UpdateAsync(id, request);
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicenciaAccesoDetalle")
            .WithSummary("Update licencia acceso detalle")
            .WithDescription("Updates an existing licencia acceso detalle by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
