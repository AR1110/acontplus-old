namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoImpuestoEndpoints
{
    Task<IResult> GetDocSustentoImpuestoAsync(string json);
    Task<IResult> GetDocSustentoImpuestoByIdAsync(int id);
    Task<IResult> CreateDocSustentoImpuestoAsync(RetAtsImpDocSustentoDto retAtsImpDocSustentoDto);
    Task<IResult> UpdateDocSustentoImpuestoAsync(int id, RetAtsImpDocSustentoDto retAtsImpDocSustentoDto);
    Task<IResult> DeleteDocSustentoImpuestoAsync(int id);
}
