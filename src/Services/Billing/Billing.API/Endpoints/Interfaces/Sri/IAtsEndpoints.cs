namespace Billing.API.Endpoints.Interfaces.Sri;

public interface IAtsEndpoints
{
    Task<IResult> CheckValidationAsync(string json, CancellationToken cancellationToken = default);
    IResult GetPeriods();
    Task<IResult> DownloadAsync(string json, CancellationToken cancellationToken = default);
}