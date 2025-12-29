using Purchases.Application.Dtos.Orders;

namespace Purchases.Application.Services;

public class OrderService(IUnitOfWork unitOfWork) : IOrderService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Purchases.Orden_";

  public async Task<Result<PagedResult<OrderItem>, DomainError>> GetAsync(PaginationRequest paginationRequest, CancellationToken cancellationToken = default)
  {
    try
    {
      var response = await _adoRepository.GetPagedFromStoredProcedureAsync<OrderItem>(
        $"{ModuleName}Get", paginationRequest, cancellationToken: cancellationToken);

      if (response.Items.Any())
      {
        return Result<PagedResult<OrderItem>, DomainError>.Success(response);
      }

      var error = DomainError.NotFound("PURCHASE_ORDER_NOT_FOUND", "No items were found.");
      return Result<PagedResult<OrderItem>, DomainError>.Failure(error);
    }
    catch (Exception ex)
    {
      var error = DomainError.Internal("PURCHASE_ORDER_GET_ERROR",
        $"An error occurred while retrieving items. {ex.Message}");
      return Result<PagedResult<OrderItem>, DomainError>.Failure(error);
    }
  }

  public async Task<Result<OrderItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
      var order = await _adoRepository.QuerySingleOrDefaultAsync<OrderItem>($"{ModuleName}GetById", parameters);
      return order != null
        ? Result<OrderItem, DomainError>.Success(order)
        : Result<OrderItem, DomainError>.Failure(DomainError.NotFound("PURCHASE_ORDER_NOT_FOUND", "Purchase order not found"));
    }
    catch (Exception ex)
    {
      return Result<OrderItem, DomainError>.Failure(DomainError.Internal("PURCHASE_ORDER_GETBYID_ERROR", ex.Message));
    }
  }

  public async Task<Result<OrderItem, DomainError>> AddAsync(OrderCreate request, CancellationToken cancellationToken = default)
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
      return Result<OrderItem, DomainError>.Failure(DomainError.Validation("PURCHASE_ORDER_ADD_ERROR", response?.Message ?? "Failed to add purchase order"));
    }
    catch (Exception ex)
    {
      return Result<OrderItem, DomainError>.Failure(DomainError.Internal("PURCHASE_ORDER_ADD_ERROR", ex.Message));
    }
  }

  public async Task<Result<OrderItem, DomainError>> UpdateAsync(int id, OrderUpdate request, int userRoleId, CancellationToken cancellationToken = default)
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
      return Result<OrderItem, DomainError>.Failure(DomainError.Validation("PURCHASE_ORDER_UPDATE_ERROR", response?.Message ?? "Failed to update purchase order"));
    }
    catch (Exception ex)
    {
      return Result<OrderItem, DomainError>.Failure(DomainError.Internal("PURCHASE_ORDER_UPDATE_ERROR", ex.Message));
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
        : Result<bool, DomainError>.Failure(DomainError.Validation("PURCHASE_ORDER_DELETE_ERROR", response?.Message ?? "Failed to delete purchase order"));
    }
    catch (Exception ex)
    {
      return Result<bool, DomainError>.Failure(DomainError.Internal("PURCHASE_ORDER_DELETE_ERROR", ex.Message));
    }
  }
}
