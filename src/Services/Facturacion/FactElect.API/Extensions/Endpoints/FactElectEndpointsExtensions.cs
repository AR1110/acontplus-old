using FactElect.API.Endpoints.Interfaces;

namespace FactElect.API.Extensions.Endpoints;

public static class FactElectEndpointsExtensions
{
    public static IEndpointRouteBuilder MapFactElectEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var retencionAtsGroup = endpointRouteBuilder.MapGroup("/api/notificaciontributaria")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("NotificacionTributaria");

        retencionAtsGroup.MapGet("/{id}",
            async (INotificacionTributariaEndpoints notificacionTributariaEndpoints, int id) =>
                await notificacionTributariaEndpoints.GetNotificacionTributariaByIdAsync(id));

        retencionAtsGroup.MapPost("/",
            async (INotificacionTributariaEndpoints notificacionTributariaEndpoints,
                    NotificacionTributariaDto notificacionTributariaDto) =>
                await notificacionTributariaEndpoints.CreateNotificacionTributariaAsync(notificacionTributariaDto));

        return endpointRouteBuilder;
    }
}