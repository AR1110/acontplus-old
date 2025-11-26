namespace Accounting.Api.Endpoints.CuotaPorCobrar;

public static class RegisterEndpoints
{
    public static IEndpointRouteBuilder MapContabilidadEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var cuotaPorCobrarGroup = endpointRouteBuilder.MapGroup("/api/cuotaporcobrar")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("CuotaPorCobrar");

        UpdateCuotaPorCobrarEndpoint.Map(cuotaPorCobrarGroup);

        return endpointRouteBuilder;
    }
}
