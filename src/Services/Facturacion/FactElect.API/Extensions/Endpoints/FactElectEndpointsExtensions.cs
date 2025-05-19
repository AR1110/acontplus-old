using FactElect.API.Endpoints.Interfaces;

namespace FactElect.API.Extensions.Endpoints;

public static class FactElectEndpointsExtensions
{
    public static IEndpointRouteBuilder MapFactElectEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var notificacionTributariaGroup = endpointRouteBuilder.MapGroup("/api/notificaciontributaria")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("NotificacionTributaria");

        notificacionTributariaGroup.MapGet("/{id}",
            async (INotificacionTributariaEndpoints notificacionTributariaEndpoints, int id) =>
                await notificacionTributariaEndpoints.GetNotificacionTributariaByIdAsync(id));

        notificacionTributariaGroup.MapPost("/",
            async (INotificacionTributariaEndpoints notificacionTributariaEndpoints,
                    NotificacionTributariaDto notificacionTributariaDto) =>
                await notificacionTributariaEndpoints.CreateNotificacionTributariaAsync(notificacionTributariaDto));

        var documentoElectronicoErrorGroup = endpointRouteBuilder.MapGroup("/api/documentoelectronicoerror")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("DocumentoElectronicoError");

        documentoElectronicoErrorGroup.MapGet("/{id}",
            async (IDocumentoElectronicoErrorEndpoints documentoElectronicoErrorEndpoints, int id) =>
                await documentoElectronicoErrorEndpoints.GetDocumentoElectronicoErrorByIdAsync(id));

        return endpointRouteBuilder;
    }
}
