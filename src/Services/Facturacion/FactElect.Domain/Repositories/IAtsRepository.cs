using System.Data;
using Common.Core.Models;

namespace FactElect.Domain.Repositories;

public interface IAtsRepository
{
    Task<ApiResponse> CheckValidationAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
}