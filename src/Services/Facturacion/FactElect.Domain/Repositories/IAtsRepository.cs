using Common.Core.Models;
using System.Data;

namespace FactElect.Domain.Repositories;

public interface IAtsRepository
{
    Task<ApiResponse> CheckValidationAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
}