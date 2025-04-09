namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IRetencionAtsEndpoints
{
    Task<IResult> GetRetencionAtsAsync(string json);
    Task<IResult> GetRetencionAtsByIdAsync(int id);
    Task<IResult> CreateRetencionAtsAsync(ApiRequest apiRequest);
    Task<IResult> UpdateRetencionAtsAsync(int id, string json);
    Task<IResult> CancelRetencionAtsAsync(int id);
    Task<IResult> DeleteRetencionAtsAsync(int id);
}
