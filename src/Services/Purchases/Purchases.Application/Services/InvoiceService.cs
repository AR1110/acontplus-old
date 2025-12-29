using Purchases.Application.Dtos.Invoices;

namespace Purchases.Application.Services;

public class InvoiceService(IUnitOfWork unitOfWork) : IInvoiceService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Purchases.Invoice";

    public async Task<Result<PagedResult<InvoiceItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _adoRepository.GetPagedFromStoredProcedureAsync<InvoiceItem>(
              $"{ModuleName}Get", paginationRequest, cancellationToken: cancellationToken);

            if (response.Items.Any())
            {
                return Result<PagedResult<InvoiceItem>, DomainError>.Success(response);
            }

            var error = DomainError.NotFound("PURCHASE_INVOICE_NOT_FOUND", "No items were found.");
            return Result<PagedResult<InvoiceItem>, DomainError>.Failure(error);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("PURCHASE_INVOICE_GET_ERROR",
              $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<InvoiceItem>, DomainError>.Failure(error);
        }
    }

    public async Task<Result<InvoiceItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var invoice = await _adoRepository.QuerySingleOrDefaultAsync<InvoiceItem>($"{ModuleName}GetById", parameters);
            return invoice != null
              ? Result<InvoiceItem, DomainError>.Success(invoice)
              : Result<InvoiceItem, DomainError>.Failure(DomainError.NotFound("PURCHASE_INVOICE_NOT_FOUND", "Purchase invoice not found"));
        }
        catch (Exception ex)
        {
            return Result<InvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<InvoiceItem, DomainError>> AddAsync(InvoiceCreate request, CancellationToken cancellationToken = default)
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
            return Result<InvoiceItem, DomainError>.Failure(DomainError.Validation("PURCHASE_INVOICE_ADD_ERROR", response?.Message ?? "Failed to add purchase invoice"));
        }
        catch (Exception ex)
        {
            return Result<InvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<InvoiceItem, DomainError>> UpdateAsync(int id, InvoiceUpdate request, int userRoleId, CancellationToken cancellationToken = default)
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
            return Result<InvoiceItem, DomainError>.Failure(DomainError.Validation("PURCHASE_INVOICE_UPDATE_ERROR", response?.Message ?? "Failed to update purchase invoice"));
        }
        catch (Exception ex)
        {
            return Result<InvoiceItem, DomainError>.Failure(DomainError.Internal("PURCHASE_INVOICE_UPDATE_ERROR", ex.Message));
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
