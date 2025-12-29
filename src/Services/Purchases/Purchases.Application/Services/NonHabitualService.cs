using Purchases.Application.Dtos.NonHabitualPurchases;


namespace Purchases.Application.Services;

public class NonHabitualService(IUnitOfWork unitOfWork) : INonHabitualService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Purchases.NonHabitual";

    public async Task<Result<PagedResult<NonHabitualPurchaseItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _adoRepository.GetPagedFromStoredProcedureAsync<NonHabitualPurchaseItem>(
              $"{ModuleName}Get", paginationRequest, cancellationToken: cancellationToken);

            if (response.Items.Any())
            {
                return Result<PagedResult<NonHabitualPurchaseItem>, DomainError>.Success(response);
            }

            var error = DomainError.NotFound("NON_HABITUAL_PURCHASE_NOT_FOUND", "No items were found.");
            return Result<PagedResult<NonHabitualPurchaseItem>, DomainError>.Failure(error);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("NON_HABITUAL_PURCHASE_GET_ERROR",
              $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<NonHabitualPurchaseItem>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<NonHabitualPurchaseItem, DomainError>> AddAsync(NonHabitualPurchaseCreate request, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object>
      {
        { "userRoleId", request.UserRoleId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
            var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
            if (response?.Code == "0")
            {
                var newId = Convert.ToInt32(response.Payload);
                var item = new NonHabitualPurchaseItem
                {
                    Id = newId,
                    SupplierId = request.SupplierId,
                    CreditTermId = request.CreditTermId,
                    IssueDate = request.IssueDate,
                    TotalExcludingTaxes = request.TotalExcludingTaxes,
                    DiscountPercentage = request.DiscountPercentage,
                    TotalAmount = request.TotalAmount,
                    Note = request.Note,
                    IncomingDocumentId = request.IncomingDocumentId,
                    EmissionPointId = request.EmissionPointId,
                    DueDate = request.DueDate,
                    DiscountAmount = request.DiscountAmount,
                    SubcategoryId = request.SubcategoryId,
                    Details = request.Details,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                return Result<NonHabitualPurchaseItem, DomainError>.Success(item);
            }
            return Result<NonHabitualPurchaseItem, DomainError>.Failure(DomainError.Validation("NON_HABITUAL_PURCHASE_ADD_ERROR", response?.Message ?? "Failed to add non-habitual purchase"));
        }
        catch (Exception ex)
        {
            return Result<NonHabitualPurchaseItem, DomainError>.Failure(DomainError.Internal("NON_HABITUAL_PURCHASE_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<NonHabitualPurchaseItem, DomainError>> UpdateAsync(int id, NonHabitualPurchaseUpdate request, CancellationToken cancellationToken = default)
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
                var item = new NonHabitualPurchaseItem
                {
                    Id = id,
                    SupplierId = request.SupplierId,
                    CreditTermId = request.CreditTermId,
                    IssueDate = request.IssueDate,
                    TotalExcludingTaxes = request.TotalExcludingTaxes,
                    DiscountPercentage = request.DiscountPercentage,
                    TotalAmount = request.TotalAmount,
                    Note = request.Note,
                    IncomingDocumentId = request.IncomingDocumentId,
                    EmissionPointId = request.EmissionPointId,
                    DueDate = request.DueDate,
                    DiscountAmount = request.DiscountAmount,
                    SubcategoryId = request.SubcategoryId,
                    Details = request.Details,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                return Result<NonHabitualPurchaseItem, DomainError>.Success(item);
            }
            return Result<NonHabitualPurchaseItem, DomainError>.Failure(DomainError.Validation("NON_HABITUAL_PURCHASE_UPDATE_ERROR", response?.Message ?? "Failed to update non-habitual purchase"));
        }
        catch (Exception ex)
        {
            return Result<NonHabitualPurchaseItem, DomainError>.Failure(DomainError.Internal("NON_HABITUAL_PURCHASE_UPDATE_ERROR", ex.Message));
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
              : Result<bool, DomainError>.Failure(DomainError.Validation("NON_HABITUAL_PURCHASE_DELETE_ERROR", response?.Message ?? "Failed to delete non-habitual purchase"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("NON_HABITUAL_PURCHASE_DELETE_ERROR", ex.Message));
        }
    }
}
