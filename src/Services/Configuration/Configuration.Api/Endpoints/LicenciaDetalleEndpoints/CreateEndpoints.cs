namespace Configuration.Api.Endpoints.LicenciaDetalleEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciadetalle")
            .RequireAuthorization()
            .WithTags("LicenciaDetalle");

        group.MapPost("/",
                async (LicenciaDetalle detalle, ILicenciaDetalleService licenciaDetalleService, IUserContext userContext) =>
                {
                    detalle.CreatedByUserId = userContext.GetUserId();
                    return await licenciaDetalleService.AddAsync(detalle).ToMinimalApiResultAsync();
                })
            .WithName("CreateLicenciaDetalle")
            .WithSummary("Create licencia detalle")
            .WithDescription("Creates a new licencia detalle")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
