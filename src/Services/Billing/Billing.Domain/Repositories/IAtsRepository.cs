using System.Data;

namespace Billing.Domain.Repositories;

public interface IAtsRepository
{
    Task<SpResponse> CheckValidationAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
    Task<DataSet> GetAsync(Dictionary<string, object> parameters, CancellationToken cancellationToken = default);
}
