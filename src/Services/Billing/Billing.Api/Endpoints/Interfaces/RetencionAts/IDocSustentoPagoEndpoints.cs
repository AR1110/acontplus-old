namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoPagoEndpoints
{
    Task<IResult> GetDocSustentoRetencionAsync(string json);
    Task<IResult> GetDocSustentoRetencionByIdAsync(int id);
    Task<IResult> CreateDocSustentoRetencionAsync(RetencionAtsPagoDto retencionAtsPagoDto);
    Task<IResult> UpdateDocSustentoRetencionAsync(int id, RetencionAtsPagoDto retencionAtsPagoDto);
    Task<IResult> DeleteDocSustentoRetencionAsync(int id, string userId);
}
