namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoPagoEndpoints
{
    Task<IResult> GetDocSustentoRetencionAsync(string json);
    Task<IResult> GetDocSustentoRetencionByIdAsync(int id);
    Task<IResult> CreateDocSustentoRetencionAsync(string json);
    Task<IResult> UpdateDocSustentoRetencionAsync(int id, string json);
    Task<IResult> DeleteDocSustentoRetencionAsync(int id, string userId);
}