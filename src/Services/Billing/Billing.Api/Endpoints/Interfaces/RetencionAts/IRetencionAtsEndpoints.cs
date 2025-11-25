namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IRetencionAtsEndpoints
{
    Task<IResult> GetRetencionAtsAsync(string json);
    Task<IResult> GetRetencionAtsByIdAsync(int id);
    Task<IResult> CreateRetencionAtsAsync(RetencionAtsDto retencionAtsDto);
    Task<IResult> UpdateRetencionAtsAsync(int id, RetencionAtsDto retencionAtsDto);
    Task<IResult> CancelRetencionAtsAsync(int id);
    Task<IResult> DeleteRetencionAtsAsync(int id);
}