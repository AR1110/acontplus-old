using Acontplus.Core.DTOs.Responses;
using System.Data;

namespace FactElect.Domain.Repositories;

public interface IAtsRepository
{
    Task<SpResponse> CheckValidationAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
}
