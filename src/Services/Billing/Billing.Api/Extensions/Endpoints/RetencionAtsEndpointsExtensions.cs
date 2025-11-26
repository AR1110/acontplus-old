namespace Billing.Api.Extensions.Endpoints;

public static class RetencionAtsEndpointsExtensions
{
    public static IEndpointRouteBuilder MapRetencionAtsEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var retencionAtsGroup = endpointRouteBuilder.MapGroup("/retencionats")
            .RequireAuthorization()
            
            .WithTags("RetencionAts");

        retencionAtsGroup.MapGet("/", async (IRetencionAtsEndpoints retencionAtsEndpoints, string json) =>
            await retencionAtsEndpoints.GetRetencionAtsAsync(json));

        retencionAtsGroup.MapGet("/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.GetRetencionAtsByIdAsync(id));

        retencionAtsGroup.MapPost("/",
            async (IRetencionAtsEndpoints retencionAtsEndpoints, RetencionAtsDto retencionAtsDto) =>
                await retencionAtsEndpoints.CreateRetencionAtsAsync(retencionAtsDto));

        retencionAtsGroup.MapPut("/{id}",
            async (IRetencionAtsEndpoints retencionAtsEndpoints, int id, RetencionAtsDto retencionAtsDto) =>
                await retencionAtsEndpoints.UpdateRetencionAtsAsync(id, retencionAtsDto));

        retencionAtsGroup.MapDelete("/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.DeleteRetencionAtsAsync(id));

        retencionAtsGroup.MapPut("/cancel/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.CancelRetencionAtsAsync(id));

        var doctSustentoGroup = endpointRouteBuilder.MapGroup("/docsustento")
            .RequireAuthorization()
            
            .WithTags("DocSustento");

        doctSustentoGroup.MapGet("/", async (IDocSustentoEndpoints docSustentoEndpoints, string json) =>
            await docSustentoEndpoints.GetDocSustentos(json));

        doctSustentoGroup.MapGet("/{id}", async (IDocSustentoEndpoints docSustentoEndpoints, int id) =>
            await docSustentoEndpoints.GetDocSustentoById(id));

        doctSustentoGroup.MapPost("/", async (IDocSustentoEndpoints printerEndpoints, RetAtsDocSustentoDto retAtsDocSustento) =>
            await printerEndpoints.CreateDocSustento(retAtsDocSustento));

        doctSustentoGroup.MapPut("/{id}",
            async (IDocSustentoEndpoints printerEndpoints, int id, RetAtsDocSustentoDto retAtsDocSustento) =>
                await printerEndpoints.UpdateDocSustento(id, retAtsDocSustento));

        doctSustentoGroup.MapDelete("/{id}", async (IDocSustentoEndpoints printerEndpoints, int id) =>
            await printerEndpoints.DeleteDocSustento(id));

        var docSustentoImpuestoGroup = endpointRouteBuilder.MapGroup("/docsustentoimpuesto")
            .RequireAuthorization()
            
            .WithTags("DocSustentoImpuesto");

        docSustentoImpuestoGroup.MapGet("/",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, string json) =>
                await docSustImpuestoEndpoints.GetDocSustentoImpuestoAsync(json));

        docSustentoImpuestoGroup.MapGet("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id) =>
                await docSustImpuestoEndpoints.GetDocSustentoImpuestoByIdAsync(id));

        docSustentoImpuestoGroup.MapPost("/",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, RetAtsImpDocSustentoDto retAtsImpDocSustentoDto) =>
                await docSustImpuestoEndpoints.CreateDocSustentoImpuestoAsync(retAtsImpDocSustentoDto));

        docSustentoImpuestoGroup.MapPut("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id, RetAtsImpDocSustentoDto retAtsImpDocSustentoDto) =>
                await docSustImpuestoEndpoints.UpdateDocSustentoImpuestoAsync(id, retAtsImpDocSustentoDto));

        docSustentoImpuestoGroup.MapDelete("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id) =>
                await docSustImpuestoEndpoints.DeleteDocSustentoImpuestoAsync(id));

        var docSustentoRetencionGroup = endpointRouteBuilder.MapGroup("/docsustentoretencion")
            .RequireAuthorization()
            
            .WithTags("DocSustentoRetencion");

        docSustentoRetencionGroup.MapGet("/",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, string json) =>
                await docSustentoRetencionEndpoints.GetDocSustentoRetencionAsync(json));

        docSustentoRetencionGroup.MapGet("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id) =>
                await docSustentoRetencionEndpoints.GetDocSustentoRetencionByIdAsync(id));

        docSustentoRetencionGroup.MapPost("/",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, RetencionAtsRetDto retencionAtsRetDto) =>
                await docSustentoRetencionEndpoints.CreateDocSustentoRetencionAsync(retencionAtsRetDto));

        docSustentoRetencionGroup.MapPut("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id, RetencionAtsRetDto retencionAtsRetDto) =>
                await docSustentoRetencionEndpoints.UpdateDocSustentoRetencionAsync(id, retencionAtsRetDto));

        docSustentoRetencionGroup.MapDelete("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id) =>
                await docSustentoRetencionEndpoints.DeleteDocSustentoRetencionAsync(id));

        var docSustentoPagoGroup = endpointRouteBuilder.MapGroup("/docsustentopago")
            .RequireAuthorization()
            
            .WithTags("DocSustentoPago");

        docSustentoPagoGroup.MapGet("/",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, string json) =>
                await docSustentoPagoEndpoints.GetDocSustentoRetencionAsync(json));

        docSustentoPagoGroup.MapGet("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id) =>
                await docSustentoPagoEndpoints.GetDocSustentoRetencionByIdAsync(id));

        docSustentoPagoGroup.MapPost("/",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, RetencionAtsPagoDto retencionAtsPagoDto) =>
                await docSustentoPagoEndpoints.CreateDocSustentoRetencionAsync(retencionAtsPagoDto));

        docSustentoPagoGroup.MapPut("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id, RetencionAtsPagoDto retencionAtsPagoDto) =>
                await docSustentoPagoEndpoints.UpdateDocSustentoRetencionAsync(id, retencionAtsPagoDto));

        docSustentoPagoGroup.MapDelete("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id) =>
                await docSustentoPagoEndpoints.DeleteDocSustentoRetencionAsync(id, string.Empty));

        var retencionAtsInfoAdicionalGroup = endpointRouteBuilder.MapGroup("/retencionatsinfoadicional")
            .RequireAuthorization()
            
            .WithTags("RetencionAtsInfoAdicional");

        retencionAtsInfoAdicionalGroup.MapGet("/",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, string json) =>
                await retencionAtsInfoAdicionalEndpoints.GetRetencionAtsInfoAdicional(json));

        retencionAtsInfoAdicionalGroup.MapGet("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id) =>
                await retencionAtsInfoAdicionalEndpoints.GetRetencionAtsInfoAdicionalById(id));

        retencionAtsInfoAdicionalGroup.MapPost("/",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, RetAtsInfoAdicionalDto retAtsInfoAdicionalDto) =>
                await retencionAtsInfoAdicionalEndpoints.CreateRetencionAtsInfoAdicional(retAtsInfoAdicionalDto));

        retencionAtsInfoAdicionalGroup.MapPut("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id, RetAtsInfoAdicionalDto retAtsInfoAdicionalDto) =>
                await retencionAtsInfoAdicionalEndpoints.UpdateRetencionAtsInfoAdicional(id, retAtsInfoAdicionalDto));

        retencionAtsInfoAdicionalGroup.MapDelete("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id) =>
                await retencionAtsInfoAdicionalEndpoints.DeleteRetencionAtsInfoAdicional(id));

        return endpointRouteBuilder;
    }
}
