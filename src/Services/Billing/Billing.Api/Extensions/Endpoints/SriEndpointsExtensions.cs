using Billing.Api.Endpoints.Interfaces.Sri;

namespace Billing.Api.Extensions.Endpoints;

public static class SriEndpointsExtensions
{
    public static IEndpointRouteBuilder MapSriEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var atsGroup = endpointRouteBuilder.MapGroup("/api/ats")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Ats");

        atsGroup.MapGet("/checkvalidation",
                async (IAtsEndpoints atsEndpoints, string json, CancellationToken cancellationToken) =>
                    await atsEndpoints.CheckValidationAsync(json, cancellationToken))
            .WithName("CheckValidationAsync")
            .WithSummary("Check Validation of ATS data")
            .Produces<SpResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        atsGroup.MapGet("/periods",
                (IAtsEndpoints atsEndpoints) => atsEndpoints.GetPeriods())
            .WithName("GetPeriods")
            .WithSummary("Get available periods for ATS")
            .Produces<object[]>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        atsGroup.MapGet("/download",
                async (IAtsEndpoints atsEndpoints, string json, CancellationToken cancellationToken) =>
                    await atsEndpoints.DownloadAsync(json, cancellationToken))
            .WithName("DownloadAsync")
            .WithSummary("Download ATS data as XML")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);

        return endpointRouteBuilder;
    }
}
