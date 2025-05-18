namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IRetencionAtsInfoAdicionalEndpoints
{
    Task<IResult> GetRetencionAtsInfoAdicional(string json);
    Task<IResult> GetRetencionAtsInfoAdicionalById(int id);
    Task<IResult> CreateRetencionAtsInfoAdicional(string json);
    Task<IResult> UpdateRetencionAtsInfoAdicional(int id, string json);
    Task<IResult> DeleteRetencionAtsInfoAdicional(int id);
}