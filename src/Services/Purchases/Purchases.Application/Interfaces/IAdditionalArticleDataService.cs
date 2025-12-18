using Purchases.Application.Dtos.Articles;

namespace Purchases.Application.Interfaces;

public interface IAdditionalArticleDataService
{
    Task<Result<IReadOnlyList<AdditionalArticleDataItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<AdditionalArticleDataItem, DomainError>> AddAsync(AdditionalArticleDataCreate request, CancellationToken cancellationToken = default);
    Task<Result<AdditionalArticleDataItem, DomainError>> UpdateAsync(int id, AdditionalArticleDataUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
