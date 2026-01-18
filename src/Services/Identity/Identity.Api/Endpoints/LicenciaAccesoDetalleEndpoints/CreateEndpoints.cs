namespace Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasaccesodetalle")
            .RequireAuthorization()
            .WithTags("LicenciasAccesoDetalle");

        group.MapPost("/",
                async (LicenciaAccesoDetalleCreate request, ILicenciaAccesoDetalleService licenciaAccesoDetalleService, IUserContext userContext) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    var result = await licenciaAccesoDetalleService.AddAsync(request);
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicenciaAccesoDetalle")
            .WithSummary("Create licencia acceso detalle")
            .WithDescription("Creates a new licencia acceso detalle")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
