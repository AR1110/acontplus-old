using Purchases.Application.Dtos.PurchaseInvoices;


namespace Purchases.Application.Services;

public class PurchaseInvoiceService(IUnitOfWork unitOfWork) : IPurchaseInvoiceService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.Factura_";

  public async Task<Result<PagedResult<PurchaseInvoiceItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
  {
    try
    {
      var response = await _adoRepository.GetPagedFromStoredProcedureAsync<PurchaseInvoiceItem>(
        $"{ModuleName}Get", paginationRequest, cancellationToken: cancellationToken);

      if (response.Items.Any())
      {
        return Result<PagedResult<PurchaseInvoiceItem>, DomainError>.Success(response);
      }

      var error = DomainError.NotFound("PURCHASE_INVOICE_NOT_FOUND", "No items were found.");
      return Result<PagedResult<PurchaseInvoiceItem>, DomainError>.Failure(error);
    }
    catch (Exception ex)
    {
      var error = DomainError.Internal("PURCHASE_INVOICE_GET_ERROR",
        $"An error occurred while retrieving items. {ex.Message}");
      return Result<PagedResult<PurchaseInvoiceItem>, DomainError>.Failure(error);
    }
  }

  public async Task<Result<PurchaseInvoiceItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
      var invoice = await _adoRepository.QuerySingleOrDefaultAsync<PurchaseInvoiceItem>($"{ModuleName}GetById", parameters);
      return invoice != null
        ? Result<PurchaseInvoiceItem, DomainError>.Success(invoice)
        : Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.NotFound("PURCHASE_INVOICE_NOT_FOUND", "Purchase invoice not found"));
    }
    catch (Exception ex)
    {
      return Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_GETBYID_ERROR", ex.Message));
    }
  }

  public async Task<Result<PurchaseInvoiceItem, DomainError>> AddAsync(PurchaseInvoiceCreate request, CancellationToken cancellationToken = default)
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
        return await GetByIdAsync(Convert.ToInt32(response.Payload), request.UserRoleId, cancellationToken);
      }
      return Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.Validation("PURCHASE_INVOICE_ADD_ERROR", response?.Message ?? "Failed to add purchase invoice"));
    }
    catch (Exception ex)
    {
      return Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_ADD_ERROR", ex.Message));
    }
  }

  public async Task<Result<PurchaseInvoiceItem, DomainError>> UpdateAsync(int id, PurchaseInvoiceUpdate request, int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object>
      {
        { "userRoleId", userRoleId },
        { "json", JsonExtensions.SerializeOptimized(request) }
      };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
      if (response?.Code == "0")
      {
        return await GetByIdAsync(id, userRoleId, cancellationToken);
      }
      return Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.Validation("PURCHASE_INVOICE_UPDATE_ERROR", response?.Message ?? "Failed to update purchase invoice"));
    }
    catch (Exception ex)
    {
      return Result<PurchaseInvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_UPDATE_ERROR", ex.Message));
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
        : Result<bool, DomainError>.Failure(DomainError.Validation("PURCHASE_INVOICE_DELETE_ERROR", response?.Message ?? "Failed to delete purchase invoice"));
    }
    catch (Exception ex)
    {
      return Result<bool, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_DELETE_ERROR", ex.Message));
    }
  }
}
