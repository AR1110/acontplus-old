using Acontplus.Billing.Services.Documents.Mapping;

namespace Billing.Api.Endpoints;

public static class SriEndpoints
{
    private const string UserRoleIdClaim = "userRoleId";

    public static void MapSriEndpoints(this IEndpointRouteBuilder app)
    {
        var atsGroup = app.MapGroup("/api/ats")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing ATS.")
            .WithTags("Ats");

        atsGroup.MapGet("/checkvalidation", CheckValidationAsync)
            .WithName("CheckValidationAsync")
            .WithSummary("Check Validation of ATS data")
            .Produces<SpResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        atsGroup.MapGet("/periods", GetPeriods)
            .WithName("GetPeriods")
            .WithSummary("Get available periods for ATS")
            .Produces<object[]>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        atsGroup.MapGet("/download", DownloadAsync)
            .WithName("DownloadAsync")
            .WithSummary("Download ATS data as XML")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static async Task<IResult> CheckValidationAsync(
        string json,
        IAtsRepository atsRepository,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await atsRepository.CheckValidationAsync(parameters, cancellationToken));
    }

    private static IResult GetPeriods()
    {
        object[]? periods = null;
        try
        {
            var years = new List<YearModel>();
            var months = Enum.GetValues<Calendar.Months>()
                .Select(t => new MonthModel { Month = (short)t, Name = t.ToString() });

            const int totalYears = 13;

            var actualYear = DateTime.Now.Year;

            for (var i = 0; i < totalYears; i++)
                years.Add(new YearModel { Year = actualYear - i });

            periods = [years, months];
        }
        catch (Exception ex)
        {
            _ = ex.Message;
        }

        return Results.Ok(periods);
    }

    private static async Task<IResult> DownloadAsync(
        string json,
        IAtsRepository atsRepository,
        Billing.Application.Interfaces.IAtsXmlService atsXmlService,
        IUserContext userContext,
        CancellationToken cancellationToken)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var ds = await atsRepository.GetAsync(parameters, cancellationToken);
        var mapper = new AtsDataSetMapper();
        var atsData = mapper.MapDataSetToAtsData(ds);
        var xmlBytes = await atsXmlService.CreateAtsXmlAsync(atsData);
        var fileName = "ATS" + "_" + atsData.Header.IdInformante
                       + "_" + atsData.Header.NumEstabRuc
                       + "_" + atsData.Header.Anio
                       + "_" + atsData.Header.Mes;

        return Results.Bytes(xmlBytes, "application/xml", $"{fileName}.xml");
    }
}
