namespace Billing.Api.Endpoints.Interfaces.RetencionAts;

public interface IDocSustentoEndpoints
{
    Task<IResult> GetDocSustentos(string json);
    Task<IResult> GetDocSustentoById(int id);
    Task<IResult> CreateDocSustento(RetAtsDocSustentoDto data);
    Task<IResult> UpdateDocSustento(int id, RetAtsDocSustentoDto data);
    Task<IResult> DeleteDocSustento(int id);
}
