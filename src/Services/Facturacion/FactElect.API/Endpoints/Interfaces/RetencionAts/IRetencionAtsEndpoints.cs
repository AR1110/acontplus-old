using FactElect.Application.DTOs.RetencionAts;

namespace FactElect.API.Endpoints.Interfaces.RetencionAts;

public interface IRetencionAtsEndpoints
{
    Task<IResult> GetRetencionAtsAsync(string json);
    Task<IResult> GetRetencionAtsByIdAsync(int id);
    Task<IResult> CreateRetencionAtsAsync(RetencionAtsRetDto retencionAtsRetDto);
    Task<IResult> UpdateRetencionAtsAsync(int id, RetencionAtsRetDto retencionAtsRetDto);
    Task<IResult> CancelRetencionAtsAsync(int id);
    Task<IResult> DeleteRetencionAtsAsync(int id);
}
