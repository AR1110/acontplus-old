using Billing.Api.Endpoints.Interfaces;

namespace Billing.Api.Extensions.Endpoints;

public static class BillingEndpointsExtensions
{
    public static IEndpointRouteBuilder MapBillingEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var notificacionTributariaGroup = endpointRouteBuilder.MapGroup("/api/notificaciontributaria")
            .RequireAuthorization()

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

            .WithTags("DocumentoElectronicoError");

        documentoElectronicoErrorGroup.MapGet("/{id}",
            async (IDocumentoElectronicoErrorEndpoints documentoElectronicoErrorEndpoints, int id) =>
                await documentoElectronicoErrorEndpoints.GetDocumentoElectronicoErrorByIdAsync(id));

        return endpointRouteBuilder;
    }
}
