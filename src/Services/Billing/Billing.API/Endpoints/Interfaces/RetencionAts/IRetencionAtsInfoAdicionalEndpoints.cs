namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IRetencionAtsInfoAdicionalEndpoints
{
    Task<IResult> GetRetencionAtsInfoAdicional(string json);
    Task<IResult> GetRetencionAtsInfoAdicionalById(int id);
    Task<IResult> CreateRetencionAtsInfoAdicional(RetAtsInfoAdicionalDto retencionAtsPagoDto);
    Task<IResult> UpdateRetencionAtsInfoAdicional(int id, RetAtsInfoAdicionalDto retAtsInfoAdicionalDto);
    Task<IResult> DeleteRetencionAtsInfoAdicional(int id);
}
