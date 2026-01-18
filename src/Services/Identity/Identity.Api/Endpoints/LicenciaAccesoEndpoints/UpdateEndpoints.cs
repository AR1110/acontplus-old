namespace Identity.Api.Endpoints.LicenciaAccesoEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasacceso")
            .RequireAuthorization()
            .WithTags("LicenciasAcceso");

        group.MapPut("/{id}",
                async (int id, LicenciaAccesoUpdate request, ILicenciaAccesoService licenciaAccesoService, IUserContext userContext) =>
                {
                    var result = await licenciaAccesoService.UpdateAsync(id, request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicenciaAcceso")
            .WithSummary("Update licencia acceso")
            .WithDescription("Updates an existing licencia acceso by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
