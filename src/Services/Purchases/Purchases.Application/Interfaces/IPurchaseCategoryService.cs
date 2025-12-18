using Purchases.Application.Dtos.PurchaseCategories;

namespace Purchases.Application.Interfaces;

public interface IPurchaseCategoryService
{
    Task<Result<IReadOnlyList<PurchaseCategoryItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<PurchaseCategoryItem, DomainError>> AddAsync(PurchaseCategoryCreate request, CancellationToken cancellationToken = default);
    Task<Result<PurchaseCategoryItem, DomainError>> UpdateAsync(int id, PurchaseCategoryUpdate request, int userRoleId, CancellationToken cancellationToken = default);
    Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default);
}
