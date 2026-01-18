namespace Identity.Api.Endpoints.LicenciaAccesoEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenciasacceso")
            .RequireAuthorization()
            .WithTags("LicenciasAcceso");

        group.MapPost("/",
                async (LicenciaAccesoCreate request, ILicenciaAccesoService licenciaAccesoService, IUserContext userContext) =>
                {
                    var result = await licenciaAccesoService.AddAsync(request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicenciaAcceso")
            .WithSummary("Create licencia acceso")
            .WithDescription("Creates a new licencia acceso")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
