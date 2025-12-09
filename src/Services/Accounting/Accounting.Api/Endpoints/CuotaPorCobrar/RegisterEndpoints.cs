namespace Accounting.Api.Endpoints.CuotaPorCobrar;

public static class RegisterEndpoints
{
    public static IEndpointRouteBuilder MapContabilidadEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var cuotaPorCobrarGroup = endpointRouteBuilder.MapGroup("/api/cuotaporcobrar")
            .RequireAuthorization()

            .WithTags("CuotaPorCobrar");

        UpdateCuotaPorCobrarEndpoint.Map(cuotaPorCobrarGroup);

        return endpointRouteBuilder;
    }
}
