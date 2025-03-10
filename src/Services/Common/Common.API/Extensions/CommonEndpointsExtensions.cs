using Common.API.Endpoints.Interfaces;

namespace Common.API.Extensions;

public static class CommonEndpointsExtensions
{
    public static IEndpointRouteBuilder MapCommonEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var commonGroup = endpointRouteBuilder.MapGroup("/api")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Dashbaord;Releases");

        commonGroup.MapGet("/dashboard", async (ICommonEndpoints commonEndpoints, string json) =>
           await commonEndpoints.GetDashboardAsync(json));

        commonGroup.MapGet("/release", async (ICommonEndpoints commonEndpoints) =>
           await commonEndpoints.GetReleaseAsync());

        return endpointRouteBuilder;
    }
}
