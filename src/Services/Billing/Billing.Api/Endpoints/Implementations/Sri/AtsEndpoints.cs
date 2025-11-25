using Acontplus.Billing.Services.Documents.Mapping;
using Billing.Api.Endpoints.Interfaces.Sri;

namespace Billing.Api.Endpoints.Implementations.Sri;

public class AtsEndpoints(IUserContext userContext, IAtsRepository atsRepository, Billing.Application.Interfaces.IAtsXmlService atsXmlService)
    : IAtsEndpoints
{
    private const string UserRoleIdClaim = "userRoleId";

    public async Task<IResult> CheckValidationAsync(string json, CancellationToken cancellationToken)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Results.Ok(await atsRepository.CheckValidationAsync(parameters, cancellationToken));
    }

    public IResult GetPeriods()
    {
        object[]? periods = null;
        try
        {
            var years = new List<YearModel>();
            var months = Enum.GetValues<Calendar.Months>()
                .Select(t => new MonthModel { Month = (short)t, Name = t.ToString() });

            const int totalYears = 13;

            var actualYear = DateTime.Now.Year;

            for (var i = 0; i < totalYears; i++) years.Add(new YearModel { Year = actualYear - i });

            periods = [years, months];
        }
        catch (Exception ex)
        {
            _ = ex.Message;
        }

        return Results.Ok(periods);
    }

    public async Task<IResult> DownloadAsync(string json, CancellationToken cancellationToken)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleIdClaim) }, { "json", SqlStringParam.Sanitize(json) }
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
