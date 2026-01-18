namespace Configuration.Api.Endpoints.LicenciaDetalleEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciadetalle")
            .RequireAuthorization()
            .WithTags("LicenciaDetalle");

        group.MapPut("/{id:int}",
                async (int id, LicenciaDetalle detalle, ILicenciaDetalleService licenciaDetalleService, IUserContext userContext) =>
                {
                    detalle.UpdatedByUserId = userContext.GetUserId();
                    return await licenciaDetalleService.UpdateAsync(id, detalle).ToMinimalApiResultAsync();
                })
            .WithName("UpdateLicenciaDetalle")
            .WithSummary("Update licencia detalle")
            .WithDescription("Updates an existing licencia detalle")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
