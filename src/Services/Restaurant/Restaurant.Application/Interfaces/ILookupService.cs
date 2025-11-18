using Acontplus.Core.Dtos.Requests;
using Acontplus.Core.Dtos.Responses;
using Restaurant.Application.Dtos;

namespace Restaurant.Application.Interfaces;

public interface ILookupService
{
    Task<Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>> GetLookupsAsync(FilterRequest filterRequest, CancellationToken cancellationToken = default);
    Task<Result<IDictionary<string, IEnumerable<LookupItem>>, DomainError>> RefreshLookupsAsync(FilterRequest filterRequest, CancellationToken cancellationToken = default);
}
