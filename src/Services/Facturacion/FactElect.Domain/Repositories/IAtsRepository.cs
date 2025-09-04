using Acontplus.Core.DTOs.Requests;
using System.Data;
using Acontplus.Core.DTOs.Responses;

namespace FactElect.Domain.Repositories;

public interface IAtsRepository
{
    Task<SpResponse> CheckValidationAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
}
