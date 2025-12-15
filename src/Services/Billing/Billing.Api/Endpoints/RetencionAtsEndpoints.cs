namespace Billing.Api.Endpoints;

public static class RetencionAtsEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public static void MapRetencionAtsEndpoints(this IEndpointRouteBuilder app)
    {
        var retencionAtsGroup = app.MapGroup("/retencionats")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Retencion ATS.")
            .WithTags("RetencionAts");

        retencionAtsGroup.MapGet("/", GetRetencionAtsAsync)
            .WithName("GetRetencionAts")
            .WithSummary("Get retencion ATS list")
            .Produces<object>(StatusCodes.Status200OK);

        retencionAtsGroup.MapGet("/{id}", GetRetencionAtsByIdAsync)
            .WithName("GetRetencionAtsById")
            .WithSummary("Get retencion ATS by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        retencionAtsGroup.MapPost("/", CreateRetencionAtsAsync)
            .WithName("CreateRetencionAts")
            .WithSummary("Create new retencion ATS")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        retencionAtsGroup.MapPut("/{id}", UpdateRetencionAtsAsync)
            .WithName("UpdateRetencionAts")
            .WithSummary("Update retencion ATS")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        retencionAtsGroup.MapDelete("/{id}", DeleteRetencionAtsAsync)
            .WithName("DeleteRetencionAts")
            .WithSummary("Delete retencion ATS")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        retencionAtsGroup.MapPut("/cancel/{id}", CancelRetencionAtsAsync)
            .WithName("CancelRetencionAts")
            .WithSummary("Cancel retencion ATS")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        var doctSustentoGroup = app.MapGroup("/docsustento")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Doc Sustento.")
            .WithTags("DocSustento");

        doctSustentoGroup.MapGet("/", GetDocSustentos)
            .WithName("GetDocSustentos")
            .WithSummary("Get doc sustento list")
            .Produces<object>(StatusCodes.Status200OK);

        doctSustentoGroup.MapGet("/{id}", GetDocSustentoById)
            .WithName("GetDocSustentoById")
            .WithSummary("Get doc sustento by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        doctSustentoGroup.MapPost("/", CreateDocSustento)
            .WithName("CreateDocSustento")
            .WithSummary("Create new doc sustento")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        doctSustentoGroup.MapPut("/{id}", UpdateDocSustento)
            .WithName("UpdateDocSustento")
            .WithSummary("Update doc sustento")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        doctSustentoGroup.MapDelete("/{id}", DeleteDocSustento)
            .WithName("DeleteDocSustento")
            .WithSummary("Delete doc sustento")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        var docSustentoImpuestoGroup = app.MapGroup("/docsustentoimpuesto")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Doc Sustento Impuesto.")
            .WithTags("DocSustentoImpuesto");

        docSustentoImpuestoGroup.MapGet("/", GetDocSustentoImpuestoAsync)
            .WithName("GetDocSustentoImpuesto")
            .WithSummary("Get doc sustento impuesto list")
            .Produces<object>(StatusCodes.Status200OK);

        docSustentoImpuestoGroup.MapGet("/{id}", GetDocSustentoImpuestoByIdAsync)
            .WithName("GetDocSustentoImpuestoById")
            .WithSummary("Get doc sustento impuesto by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        docSustentoImpuestoGroup.MapPost("/", CreateDocSustentoImpuestoAsync)
            .WithName("CreateDocSustentoImpuesto")
            .WithSummary("Create new doc sustento impuesto")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoImpuestoGroup.MapPut("/{id}", UpdateDocSustentoImpuestoAsync)
            .WithName("UpdateDocSustentoImpuesto")
            .WithSummary("Update doc sustento impuesto")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoImpuestoGroup.MapDelete("/{id}", DeleteDocSustentoImpuestoAsync)
            .WithName("DeleteDocSustentoImpuesto")
            .WithSummary("Delete doc sustento impuesto")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        var docSustentoRetencionGroup = app.MapGroup("/docsustentoretencion")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Doc Sustento Retencion.")
            .WithTags("DocSustentoRetencion");

        docSustentoRetencionGroup.MapGet("/", GetDocSustentoRetencionAsync)
            .WithName("GetDocSustentoRetencion")
            .WithSummary("Get doc sustento retencion list")
            .Produces<object>(StatusCodes.Status200OK);

        docSustentoRetencionGroup.MapGet("/{id}", GetDocSustentoRetencionByIdAsync)
            .WithName("GetDocSustentoRetencionById")
            .WithSummary("Get doc sustento retencion by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        docSustentoRetencionGroup.MapPost("/", CreateDocSustentoRetencionAsync)
            .WithName("CreateDocSustentoRetencion")
            .WithSummary("Create new doc sustento retencion")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoRetencionGroup.MapPut("/{id}", UpdateDocSustentoRetencionAsync)
            .WithName("UpdateDocSustentoRetencion")
            .WithSummary("Update doc sustento retencion")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoRetencionGroup.MapDelete("/{id}", DeleteDocSustentoRetencionAsync)
            .WithName("DeleteDocSustentoRetencion")
            .WithSummary("Delete doc sustento retencion")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        var docSustentoPagoGroup = app.MapGroup("/docsustentopago")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Doc Sustento Pago.")
            .WithTags("DocSustentoPago");

        docSustentoPagoGroup.MapGet("/", GetDocSustentoPagoAsync)
            .WithName("GetDocSustentoPago")
            .WithSummary("Get doc sustento pago list")
            .Produces<object>(StatusCodes.Status200OK);

        docSustentoPagoGroup.MapGet("/{id}", GetDocSustentoPagoByIdAsync)
            .WithName("GetDocSustentoPagoById")
            .WithSummary("Get doc sustento pago by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        docSustentoPagoGroup.MapPost("/", CreateDocSustentoPagoAsync)
            .WithName("CreateDocSustentoPago")
            .WithSummary("Create new doc sustento pago")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoPagoGroup.MapPut("/{id}", UpdateDocSustentoPagoAsync)
            .WithName("UpdateDocSustentoPago")
            .WithSummary("Update doc sustento pago")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        docSustentoPagoGroup.MapDelete("/{id}", DeleteDocSustentoPagoAsync)
            .WithName("DeleteDocSustentoPago")
            .WithSummary("Delete doc sustento pago")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        var retencionAtsInfoAdicionalGroup = app.MapGroup("/retencionatsinfoadicional")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing Retencion ATS Info Adicional.")
            .WithTags("RetencionAtsInfoAdicional");

        retencionAtsInfoAdicionalGroup.MapGet("/", GetRetencionAtsInfoAdicional)
            .WithName("GetRetencionAtsInfoAdicional")
            .WithSummary("Get retencion ATS info adicional list")
            .Produces<object>(StatusCodes.Status200OK);

        retencionAtsInfoAdicionalGroup.MapGet("/{id}", GetRetencionAtsInfoAdicionalById)
            .WithName("GetRetencionAtsInfoAdicionalById")
            .WithSummary("Get retencion ATS info adicional by ID")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        retencionAtsInfoAdicionalGroup.MapPost("/", CreateRetencionAtsInfoAdicional)
            .WithName("CreateRetencionAtsInfoAdicional")
            .WithSummary("Create new retencion ATS info adicional")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        retencionAtsInfoAdicionalGroup.MapPut("/{id}", UpdateRetencionAtsInfoAdicional)
            .WithName("UpdateRetencionAtsInfoAdicional")
            .WithSummary("Update retencion ATS info adicional")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        retencionAtsInfoAdicionalGroup.MapDelete("/{id}", DeleteRetencionAtsInfoAdicional)
            .WithName("DeleteRetencionAtsInfoAdicional")
            .WithSummary("Delete retencion ATS info adicional")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    // RetencionAts endpoints
    private static async Task<IResult> GetRetencionAtsAsync(
        string json,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await retencionAtsService.GetAsync(parameters));
    }

    private static async Task<IResult> GetRetencionAtsByIdAsync(
        int id,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await retencionAtsService.GetByIdAsync(parameters));
    }

    private static async Task<IResult> CreateRetencionAtsAsync(
        RetencionAtsDto retencionAtsDto,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var dataSerialized = DataConverters.SerializeObjectCustom<RetencionAtsDto>(retencionAtsDto);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(dataSerialized) }
        };

        return Results.Ok(await retencionAtsService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateRetencionAtsAsync(
        int id,
        RetencionAtsDto retencionAtsDto,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            {
                "json",
                SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<RetencionAtsDto>(retencionAtsDto))
            }
        };

        return Results.Ok(await retencionAtsService.UpdateAsync(parameters));
    }

    private static async Task<IResult> CancelRetencionAtsAsync(
        int id,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id },
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }
        };
        return Results.Ok(await retencionAtsService.CancelAsync(parameters));
    }

    private static async Task<IResult> DeleteRetencionAtsAsync(
        int id,
        IRetencionAtsService retencionAtsService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id },
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) }
        };
        return Results.Ok(await retencionAtsService.DeleteAsync(parameters));
    }

    // DocSustento endpoints
    private static async Task<IResult> GetDocSustentos(
        string json,
        IDocSustentoService docSustentoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await docSustentoService.GetAsync(parameters));
    }

    private static Task<IResult> GetDocSustentoById(int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<IResult> CreateDocSustento(
        RetAtsDocSustentoDto retAtsDocSustento,
        IDocSustentoService docSustentoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsDocSustentoDto>(retAtsDocSustento) }
        };
        return Results.Ok(await docSustentoService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateDocSustento(
        int id,
        RetAtsDocSustentoDto retAtsDocSustento,
        IDocSustentoService docSustentoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetAtsDocSustentoDto>(retAtsDocSustento) }
        };
        return Results.Ok(await docSustentoService.UpdateAsync(parameters));
    }

    private static async Task<IResult> DeleteDocSustento(
        int id,
        IDocSustentoService docSustentoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await docSustentoService.DeleteAsync(parameters));
    }

    // DocSustentoImpuesto endpoints
    private static Task<IResult> GetDocSustentoImpuestoAsync(string json)
    {
        throw new NotImplementedException();
    }

    private static Task<IResult> GetDocSustentoImpuestoByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<IResult> CreateDocSustentoImpuestoAsync(
        RetAtsImpDocSustentoDto retAtsImpDocSustentoDto,
        IDocSustentoImpuestoService docSustentoImpuestoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsImpDocSustentoDto>(retAtsImpDocSustentoDto) }
        };
        return Results.Ok(await docSustentoImpuestoService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateDocSustentoImpuestoAsync(
        int id,
        RetAtsImpDocSustentoDto retAtsImpDocSustentoDto,
        IDocSustentoImpuestoService docSustentoImpuestoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetAtsImpDocSustentoDto>(retAtsImpDocSustentoDto) }
        };
        return Results.Ok(await docSustentoImpuestoService.UpdateAsync(parameters));
    }

    private static async Task<IResult> DeleteDocSustentoImpuestoAsync(
        int id,
        IDocSustentoImpuestoService docSustentoImpuestoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await docSustentoImpuestoService.DeleteAsync(parameters));
    }

    // DocSustentoRetencion endpoints
    private static Task<IResult> GetDocSustentoRetencionAsync(string json)
    {
        throw new NotImplementedException();
    }

    private static Task<IResult> GetDocSustentoRetencionByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<IResult> CreateDocSustentoRetencionAsync(
        RetencionAtsRetDto retencionAtsRetDto,
        IDocSustentoRetencionService docSustentoRetencionService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsRetDto>(retencionAtsRetDto) }
        };
        return Results.Ok(await docSustentoRetencionService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateDocSustentoRetencionAsync(
        int id,
        RetencionAtsRetDto retencionAtsRetDto,
        IDocSustentoRetencionService docSustentoRetencionService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsRetDto>(retencionAtsRetDto) }
        };
        return Results.Ok(await docSustentoRetencionService.UpdateAsync(parameters));
    }

    private static async Task<IResult> DeleteDocSustentoRetencionAsync(
        int id,
        IDocSustentoRetencionService docSustentoRetencionService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await docSustentoRetencionService.DeleteAsync(parameters));
    }

    // DocSustentoPago endpoints
    private static Task<IResult> GetDocSustentoPagoAsync(string json)
    {
        throw new NotImplementedException();
    }

    private static Task<IResult> GetDocSustentoPagoByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<IResult> CreateDocSustentoPagoAsync(
        RetencionAtsPagoDto retencionAtsPagoDto,
        IDocSustentoPagoService docSustentoPagoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsPagoDto>(retencionAtsPagoDto) }
        };
        return Results.Ok(await docSustentoPagoService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateDocSustentoPagoAsync(
        int id,
        RetencionAtsPagoDto retencionAtsPagoDto,
        IDocSustentoPagoService docSustentoPagoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetencionAtsPagoDto>(retencionAtsPagoDto) }
        };
        return Results.Ok(await docSustentoPagoService.UpdateAsync(parameters));
    }

    private static async Task<IResult> DeleteDocSustentoPagoAsync(
        int id,
        IDocSustentoPagoService docSustentoPagoService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
            { "id", id }
        };
        return Results.Ok(await docSustentoPagoService.DeleteAsync(parameters));
    }

    // RetencionAtsInfoAdicional endpoints
    private static Task<IResult> GetRetencionAtsInfoAdicional(string json)
    {
        throw new NotImplementedException();
    }

    private static Task<IResult> GetRetencionAtsInfoAdicionalById(int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<IResult> CreateRetencionAtsInfoAdicional(
        RetAtsInfoAdicionalDto retAtsInfoAdicionalDto,
        IRetencionAtsInfoAdicionalService retencionAtsInfoAdicionalService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", DataConverters.SerializeObjectCustom<RetAtsInfoAdicionalDto>(retAtsInfoAdicionalDto) }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.AddAsync(parameters));
    }

    private static async Task<IResult> UpdateRetencionAtsInfoAdicional(
        int id,
        RetAtsInfoAdicionalDto retAtsInfoAdicionalDto,
        IRetencionAtsInfoAdicionalService retencionAtsInfoAdicionalService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<RetAtsInfoAdicionalDto>(retAtsInfoAdicionalDto) }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.UpdateAsync(parameters));
    }

    private static async Task<IResult> DeleteRetencionAtsInfoAdicional(
        int id,
        IRetencionAtsInfoAdicionalService retencionAtsInfoAdicionalService,
        IUserContext userContext)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id }
        };
        return Results.Ok(await retencionAtsInfoAdicionalService.DeleteAsync(parameters));
    }
}
