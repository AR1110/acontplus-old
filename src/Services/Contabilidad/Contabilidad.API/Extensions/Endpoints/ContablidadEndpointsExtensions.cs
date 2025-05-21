using Contabilidad.API.Endpoints.Interfaces;

namespace Contabilidad.API.Extensions.Endpoints;

public static class ContablidadEndpointsExtensions
{
    public static IEndpointRouteBuilder MapContabilidadEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var cuotaPorCobrarGroup = endpointRouteBuilder.MapGroup("/api/cuotaporcobrar")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("CuotaPorCobrar");

        cuotaPorCobrarGroup.MapPut("/{id}",
            async (ICuotaPorCobrarEndpoints endpoints, int id,
                    CuotaPorCobrarUpdateDto param) =>
                await endpoints.UpdateAsync(param));

        return endpointRouteBuilder;
    }
}
