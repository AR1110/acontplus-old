using FactElect.API.Endpoints.Interfaces.RetencionAts;

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

        retencionAtsGroup.MapPost("/", async (IRetencionAtsEndpoints retencionAtsEndpoints, ApiRequest apiRequest) =>
            await retencionAtsEndpoints.CreateRetencionAtsAsync(apiRequest));

        retencionAtsGroup.MapPut("/{id}",
            async (IRetencionAtsEndpoints retencionAtsEndpoints, int id, ApiRequest apiRequest) =>
                await retencionAtsEndpoints.UpdateRetencionAtsAsync(id, apiRequest));

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

        return endpointRouteBuilder;
    }
}
