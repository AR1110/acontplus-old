using FactElect.API.Endpoints.Interfaces.RetencionAts;

namespace FactElect.API.Extensions.Endpoints;

public static class RetencionAtsEndpointsExtensions
{
    private const string ApiGroup = "/api/";

    public static IEndpointRouteBuilder MapRetencionAtsEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var retencionAtsGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}DocSustento")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocSustento");

        retencionAtsGroup.MapGet("/", async (IDocSustentoEndpoints docSustentoEndpoints, string json) =>
            await docSustentoEndpoints.GetDocSustentos(json));

        retencionAtsGroup.MapGet("/{id}", async (IDocSustentoEndpoints docSustentoEndpoints, int id) =>
            await docSustentoEndpoints.GetDocSustentoById(id));

        retencionAtsGroup.MapPost("/", async (IDocSustentoEndpoints printerEndpoints, ApiRequest apiRequest) =>
            await printerEndpoints.CreateDocSustento(apiRequest));

        retencionAtsGroup.MapPut("/{id}", async (IDocSustentoEndpoints printerEndpoints, int id, ApiRequest apiRequest) =>
            await printerEndpoints.UpdateDocSustento(id, apiRequest));

        retencionAtsGroup.MapDelete("/{id}", async (IDocSustentoEndpoints printerEndpoints, int id) =>
            await printerEndpoints.DeleteDocSustento(id));

        return endpointRouteBuilder;
    }
}
