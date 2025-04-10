using FactElect.API.Endpoints.Interfaces.RetencionAts;
using FactElect.Application.DTOs.RetencionAts;

namespace FactElect.API.Extensions.Endpoints;

public static class RetencionAtsEndpointsExtensions
{
    private const string ApiGroup = "/api/";

    public static IEndpointRouteBuilder MapRetencionAtsEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var retencionAtsGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}RetencionAts")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("RetencionAts");

        retencionAtsGroup.MapGet("/", async (IRetencionAtsEndpoints retencionAtsEndpoints, string json) =>
            await retencionAtsEndpoints.GetRetencionAtsAsync(json));

        retencionAtsGroup.MapGet("/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.GetRetencionAtsByIdAsync(id));

        retencionAtsGroup.MapPost("/", async (IRetencionAtsEndpoints retencionAtsEndpoints, RetencionAtsRetDto retencionAtsRetDto) =>
            await retencionAtsEndpoints.CreateRetencionAtsAsync(retencionAtsRetDto));

        retencionAtsGroup.MapPut("/{id}",
            async (IRetencionAtsEndpoints retencionAtsEndpoints, int id, RetencionAtsRetDto retencionAtsRetDto) =>
                await retencionAtsEndpoints.UpdateRetencionAtsAsync(id, retencionAtsRetDto));

        retencionAtsGroup.MapDelete("/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.DeleteRetencionAtsAsync(id));

        retencionAtsGroup.MapPost("/cancel/{id}", async (IRetencionAtsEndpoints retencionAtsEndpoints, int id) =>
            await retencionAtsEndpoints.CancelRetencionAtsAsync(id));

        var doctSustentoGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}DocSustento")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocSustento");

        doctSustentoGroup.MapGet("/", async (IDocSustentoEndpoints docSustentoEndpoints, string json) =>
            await docSustentoEndpoints.GetDocSustentos(json));

        doctSustentoGroup.MapGet("/{id}", async (IDocSustentoEndpoints docSustentoEndpoints, int id) =>
            await docSustentoEndpoints.GetDocSustentoById(id));

        doctSustentoGroup.MapPost("/", async (IDocSustentoEndpoints printerEndpoints, ApiRequest apiRequest) =>
            await printerEndpoints.CreateDocSustento(apiRequest));

        doctSustentoGroup.MapPut("/{id}",
            async (IDocSustentoEndpoints printerEndpoints, int id, ApiRequest apiRequest) =>
                await printerEndpoints.UpdateDocSustento(id, apiRequest));

        doctSustentoGroup.MapDelete("/{id}", async (IDocSustentoEndpoints printerEndpoints, int id) =>
            await printerEndpoints.DeleteDocSustento(id));

        var docSustentoImpuestoGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}DocSustentoImpuesto")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocSustentoImpuesto");

        docSustentoImpuestoGroup.MapGet("/",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, string json) =>
                await docSustImpuestoEndpoints.GetDocSustentoImpuestoAsync(json));

        docSustentoImpuestoGroup.MapGet("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id) =>
                await docSustImpuestoEndpoints.GetDocSustentoImpuestoByIdAsync(id));

        docSustentoImpuestoGroup.MapPost("/",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, string json) =>
                await docSustImpuestoEndpoints.CreateDocSustentoImpuestoAsync(json));

        docSustentoImpuestoGroup.MapPut("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id, string json) =>
                await docSustImpuestoEndpoints.UpdateDocSustentoImpuestoAsync(id, json));

        docSustentoImpuestoGroup.MapDelete("/{id}",
            async (IDocSustentoImpuestoEndpoints docSustImpuestoEndpoints, int id) =>
                await docSustImpuestoEndpoints.DeleteDocSustentoImpuestoAsync(id));

        var docSustentoRetencionGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}DocSustentoRetencion")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocSustentoRetencion");

        docSustentoRetencionGroup.MapGet("/",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, string json) =>
                await docSustentoRetencionEndpoints.GetDocSustentoRetencionAsync(json));

        docSustentoRetencionGroup.MapGet("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id) =>
                await docSustentoRetencionEndpoints.GetDocSustentoRetencionByIdAsync(id));

        docSustentoRetencionGroup.MapPost("/",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, string json) =>
                await docSustentoRetencionEndpoints.CreateDocSustentoRetencionAsync(json));

        docSustentoRetencionGroup.MapPut("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id, string json) =>
                await docSustentoRetencionEndpoints.UpdateDocSustentoRetencionAsync(id, json));

        docSustentoRetencionGroup.MapDelete("/{id}",
            async (IDocSustentoRetencionEndpoints docSustentoRetencionEndpoints, int id) =>
                await docSustentoRetencionEndpoints.DeleteDocSustentoRetencionAsync(id));

        var docSustentoPagoGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}DocSustentoPago")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocSustentoPago");

        docSustentoPagoGroup.MapGet("/",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, string json) =>
                await docSustentoPagoEndpoints.GetDocSustentoRetencionAsync(json));

        docSustentoPagoGroup.MapGet("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id) =>
                await docSustentoPagoEndpoints.GetDocSustentoRetencionByIdAsync(id));

        docSustentoPagoGroup.MapPost("/",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, string json) =>
                await docSustentoPagoEndpoints.CreateDocSustentoRetencionAsync(json));

        docSustentoPagoGroup.MapPut("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id, string json) =>
                await docSustentoPagoEndpoints.UpdateDocSustentoRetencionAsync(id, json));

        docSustentoPagoGroup.MapDelete("/{id}",
            async (IDocSustentoPagoEndpoints docSustentoPagoEndpoints, int id) =>
                await docSustentoPagoEndpoints.DeleteDocSustentoRetencionAsync(id, string.Empty));

        var retencionAtsInfoAdicionalGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}RetencionAtsInfoAdicional")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("RetencionAtsInfoAdicional");

        retencionAtsInfoAdicionalGroup.MapGet("/",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, string json) =>
                await retencionAtsInfoAdicionalEndpoints.GetRetencionAtsInfoAdicional(json));

        retencionAtsInfoAdicionalGroup.MapGet("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id) =>
                await retencionAtsInfoAdicionalEndpoints.GetRetencionAtsInfoAdicionalById(id));

        retencionAtsInfoAdicionalGroup.MapPost("/",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, string json) =>
                await retencionAtsInfoAdicionalEndpoints.CreateRetencionAtsInfoAdicional(json));

        retencionAtsInfoAdicionalGroup.MapPut("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id, string json) =>
                await retencionAtsInfoAdicionalEndpoints.UpdateRetencionAtsInfoAdicional(id, json));

        retencionAtsInfoAdicionalGroup.MapDelete("/{id}",
            async (IRetencionAtsInfoAdicionalEndpoints retencionAtsInfoAdicionalEndpoints, int id) =>
                await retencionAtsInfoAdicionalEndpoints.DeleteRetencionAtsInfoAdicional(id));

        return endpointRouteBuilder;
    }
}
