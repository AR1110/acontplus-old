using Purchases.Application.Dtos.HabitualPurchases;


namespace Purchases.Application.Services;

public class HabitualPurchaseService(IUnitOfWork unitOfWork) : IHabitualPurchaseService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.CompraHabitual_";

  public async Task<Result<PagedResult<HabitualPurchaseItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
  {
    try
    {
      var response = await _adoRepository.GetPagedFromStoredProcedureAsync<HabitualPurchaseItem>(
        $"{ModuleName}Get", paginationRequest, cancellationToken: cancellationToken);

      if (response.Items.Any())
      {
        return Result<PagedResult<HabitualPurchaseItem>, DomainError>.Success(response);
      }

      var error = DomainError.NotFound("HABITUAL_PURCHASE_NOT_FOUND", "No items were found.");
      return Result<PagedResult<HabitualPurchaseItem>, DomainError>.Failure(error);
    }
    catch (Exception ex)
    {
      var error = DomainError.Internal("HABITUAL_PURCHASE_GET_ERROR",
        $"An error occurred while retrieving items. {ex.Message}");
      return Result<PagedResult<HabitualPurchaseItem>, DomainError>.Failure(error);
    }
  }

  public async Task<Result<HabitualPurchaseItem, DomainError>> AddAsync(HabitualPurchaseCreate request, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object>
      {
        { "userRoleId", request.CreatedByUserId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
      if (response?.Code == "0")
      {
        var newId = Convert.ToInt32(response.Payload);
        var item = new HabitualPurchaseItem(newId, request.PurchaseBase, request.Details, true, DateTime.UtcNow);
        return Result<HabitualPurchaseItem, DomainError>.Success(item);
      }
      return Result<HabitualPurchaseItem, DomainError>.Failure(DomainError.Validation("HABITUAL_PURCHASE_ADD_ERROR", response?.Message ?? "Failed to add habitual purchase"));
    }
    catch (Exception ex)
    {
      return Result<HabitualPurchaseItem, DomainError>.Failure(DomainError.Internal("HABITUAL_PURCHASE_ADD_ERROR", ex.Message));
    }
  }

  public async Task<Result<HabitualPurchaseItem, DomainError>> UpdateAsync(int id, HabitualPurchaseUpdate request, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object>
      {
        { "userRoleId", request.Id },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
      if (response?.Code == "0")
      {
        var item = new HabitualPurchaseItem(id, request.PurchaseBase, request.Details, true, DateTime.UtcNow);
        return Result<HabitualPurchaseItem, DomainError>.Success(item);
      }
      return Result<HabitualPurchaseItem, DomainError>.Failure(DomainError.Validation("HABITUAL_PURCHASE_UPDATE_ERROR", response?.Message ?? "Failed to update habitual purchase"));
    }
    catch (Exception ex)
    {
      return Result<HabitualPurchaseItem, DomainError>.Failure(DomainError.Internal("HABITUAL_PURCHASE_UPDATE_ERROR", ex.Message));
    }
  }

  public async Task<Result<bool, DomainError>> DeleteAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Delete", parameters);
      return response?.Code == "0"
        ? Result<bool, DomainError>.Success(true)
        : Result<bool, DomainError>.Failure(DomainError.Validation("HABITUAL_PURCHASE_DELETE_ERROR", response?.Message ?? "Failed to delete habitual purchase"));
    }
    catch (Exception ex)
    {
      return Result<bool, DomainError>.Failure(DomainError.Internal("HABITUAL_PURCHASE_DELETE_ERROR", ex.Message));
    }
  }
}
