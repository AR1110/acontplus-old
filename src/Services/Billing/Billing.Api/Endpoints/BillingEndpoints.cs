namespace Billing.Api.Endpoints;

public static class BillingEndpoints
{
    public static void MapBillingEndpoints(this IEndpointRouteBuilder app)
    {
        var notificacionTributariaGroup = app.MapGroup("/api/notificaciontributaria")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Notificacion Tributaria.")
            .WithTags("NotificacionTributaria");

        notificacionTributariaGroup.MapGet("/{id}", GetNotificacionTributariaByIdAsync)
            .WithName("GetNotificacionTributariaById")
            .WithSummary("Get notificacion tributaria by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        notificacionTributariaGroup.MapPost("/", CreateNotificacionTributariaAsync)
            .WithName("CreateNotificacionTributaria")
            .WithSummary("Create new notificacion tributaria")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        var documentoElectronicoErrorGroup = app.MapGroup("/api/documentoelectronicoerror")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Documento Electronico Errors.")
            .WithTags("DocumentoElectronicoError");

        documentoElectronicoErrorGroup.MapGet("/{id}", GetDocumentoElectronicoErrorByIdAsync)
            .WithName("GetDocumentoElectronicoErrorById")
            .WithSummary("Get documento electronico error by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> GetNotificacionTributariaByIdAsync(
        int id,
        INotificacionTributariaService notificacionTributariaService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Results.Ok(await notificacionTributariaService.GetAsync(parameters));
    }

    private static async Task<IResult> CreateNotificacionTributariaAsync(
        NotificacionTributariaDto notificacionTributariaDto,
        INotificacionTributariaService notificacionTributariaService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<NotificacionTributariaDto>(notificacionTributariaDto) }
        };
        return Results.Ok(await notificacionTributariaService.AddAsync(parameters));
    }

    private static async Task<IResult> GetDocumentoElectronicoErrorByIdAsync(
        int id,
        IDocumentoElectronicoErrorService documentoElectronicoErrorService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
        return Results.Ok(await documentoElectronicoErrorService.GetAsync(parameters));
    }
}
