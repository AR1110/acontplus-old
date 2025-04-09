namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoImpuestoEndpoints
{
    Task<IResult> GetDocSustentoImpuestoAsync(string json);
    Task<IResult> GetDocSustentoImpuestoByIdAsync(int id);
    Task<IResult> CreateDocSustentoImpuestoAsync(string json);
    Task<IResult> UpdateDocSustentoImpuestoAsync(int id, string json);
    Task<IResult> DeleteDocSustentoImpuestoAsync(int id);
}
