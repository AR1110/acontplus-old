namespace Configuration.Api.Endpoints.LicenciaDetalleEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciadetalle")
            .RequireAuthorization()
            .WithTags("LicenciaDetalle");

        group.MapDelete("/{id:int}",
                async (int id, ILicenciaDetalleService licenciaDetalleService, IUserContext userContext) =>
                {
                    var userId = userContext.GetUserId();
                    return await licenciaDetalleService.DeleteAsync(id, userId).ToMinimalApiResultAsync();
                })
            .WithName("DeleteLicenciaDetalle")
            .WithSummary("Delete licencia detalle")
            .WithDescription("Deletes a licencia detalle")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
