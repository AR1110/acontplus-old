namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoEndpoints
{
    Task<IResult> GetDocSustentos(string json);
    Task<IResult> GetDocSustentoById(int id);
    Task<IResult> CreateDocSustento(ApiRequest data);
    Task<IResult> UpdateDocSustento(int id, ApiRequest data);
    Task<IResult> DeleteDocSustento(int id);
}