using Acontplus.Core.Domain.Common.Results;

namespace Identity.Api.Interfaces;

public interface IActionService
{
    Task<Result<ActionItem, DomainError>> AddAsync(ActionCreate request, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<ActionItem>, DomainError>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<ActionItem, DomainError>> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<Result<ActionItem, DomainError>> UpdateAsync(int id, ActionUpdate request,
        CancellationToken cancellationToken = default);

    Task<Result<bool, DomainError>> ExistsAsync(string code, string name, int? excludeId = null,
        CancellationToken cancellationToken = default);
}
