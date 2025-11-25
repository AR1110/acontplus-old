namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoRetencionEndpoints
{
    Task<IResult> GetDocSustentoRetencionAsync(string json);
    Task<IResult> GetDocSustentoRetencionByIdAsync(int id);
    Task<IResult> CreateDocSustentoRetencionAsync(RetencionAtsRetDto retencionAtsRetDto);
    Task<IResult> UpdateDocSustentoRetencionAsync(int id, RetencionAtsRetDto retencionAtsRetDto);
    Task<IResult> DeleteDocSustentoRetencionAsync(int id);
}
