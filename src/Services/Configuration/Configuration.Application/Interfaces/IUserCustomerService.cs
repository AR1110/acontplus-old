using Acontplus.Core.Dtos.Requests;

namespace Configuration.Application.Interfaces;

public interface IUserCustomerService
{
    Task<Result<PagedResult<UserCustomerResponse>, DomainError>> GetAsync(PaginationRequest query, CancellationToken cancellationToken = default);
    Task<Result<SpResponse, DomainError>> AddAsync(Dictionary<string, object> data);
    Task<Result<SpResponse, DomainError>> UpdateAsync(Dictionary<string, object> data);
    Task<Result<SpResponse, DomainError>> UpdatePasswordAsync(Dictionary<string, object> parameters);
    Task<Result<SpResponse, DomainError>> DeleteAsync(Dictionary<string, object> data);
    Task<Result<SpResponse, DomainError>> UpdateStatus(int userId, int id, bool estado);
}
