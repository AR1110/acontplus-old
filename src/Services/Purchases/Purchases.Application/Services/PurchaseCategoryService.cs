using Purchases.Application.Dtos.PurchaseCategories;

namespace Purchases.Application.Services;

public class PurchaseCategoryService(IUnitOfWork unitOfWork) : IPurchaseCategoryService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Compra.Categoria_";

    public async Task<Result<IReadOnlyList<PurchaseCategoryItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
            var categories = await _adoRepository.QueryAsync<PurchaseCategoryItem>($"{ModuleName}Get", parameters);
            return Result<IReadOnlyList<PurchaseCategoryItem>, DomainError>.Success(categories.ToList().AsReadOnly());
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyList<PurchaseCategoryItem>, DomainError>.Failure(DomainError.Internal("CATEGORY_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<PurchaseCategoryItem, DomainError>> AddAsync(PurchaseCategoryCreate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
        { "userRoleId", request.CreatedByUserId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
            if (response?.Code == "1")
            {
                var newId = Convert.ToInt32(response.Payload);
                var item = new PurchaseCategoryItem(newId, request.Name, request.Description ?? string.Empty, true, DateTime.UtcNow);
                return Result<PurchaseCategoryItem, DomainError>.Success(item);
            }
            return Result<PurchaseCategoryItem, DomainError>.Failure(DomainError.Validation("CATEGORY_ADD_ERROR", response?.Message ?? "Failed to add category"));
        }
        catch (Exception ex)
        {
            return Result<PurchaseCategoryItem, DomainError>.Failure(DomainError.Internal("CATEGORY_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<PurchaseCategoryItem, DomainError>> UpdateAsync(int id, PurchaseCategoryUpdate request, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
        { "userRoleId", userRoleId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
            if (response?.Code == "1")
            {
                var item = new PurchaseCategoryItem(id, request.Name, request.Description ?? string.Empty, true, DateTime.UtcNow);
                return Result<PurchaseCategoryItem, DomainError>.Success(item);
            }
            return Result<PurchaseCategoryItem, DomainError>.Failure(DomainError.Validation("CATEGORY_UPDATE_ERROR", response?.Message ?? "Failed to update category"));
        }
        catch (Exception ex)
        {
            return Result<PurchaseCategoryItem, DomainError>.Failure(DomainError.Internal("CATEGORY_UPDATE_ERROR", ex.Message));
        }
    }

    public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
            return response?.Code == "1"
              ? Result<bool, DomainError>.Success(true)
              : Result<bool, DomainError>.Failure(DomainError.Validation("CATEGORY_DELETE_ERROR", response?.Message ?? "Failed to delete category"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("CATEGORY_DELETE_ERROR", ex.Message));
        }
    }
}
