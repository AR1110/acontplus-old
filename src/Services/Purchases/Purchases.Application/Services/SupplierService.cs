using Purchases.Application.Dtos.Suppliers;

namespace Purchases.Application.Services;

public class SupplierService(IUnitOfWork unitOfWork) : ISupplierService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Purchases.Supplier";

    public async Task<Result<IReadOnlyList<SupplierItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
            var suppliers = await _adoRepository.QueryAsync<SupplierItem>($"{ModuleName}Get", parameters);
            return Result<IReadOnlyList<SupplierItem>, DomainError>.Success(suppliers.ToList().AsReadOnly());
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyList<SupplierItem>, DomainError>.Failure(DomainError.Internal("SUPPLIER_GET_ERROR", ex.Message));
        }
    }

    public async Task<Result<SupplierItem, DomainError>> GetByIdAsync(int id, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "id", id }, { "userRoleId", userRoleId } };
            var supplier = await _adoRepository.QuerySingleOrDefaultAsync<SupplierItem>($"{ModuleName}GetById", parameters);
            return supplier != null
              ? Result<SupplierItem, DomainError>.Success(supplier)
              : Result<SupplierItem, DomainError>.Failure(DomainError.NotFound("SUPPLIER_NOT_FOUND", "Supplier not found"));
        }
        catch (Exception ex)
        {
            return Result<SupplierItem, DomainError>.Failure(DomainError.Internal("SUPPLIER_GETBYID_ERROR", ex.Message));
        }
    }

    public async Task<Result<SupplierItem, DomainError>> AddAsync(SupplierCreate request, CancellationToken cancellationToken = default)
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
            return Result<SupplierItem, DomainError>.Failure(DomainError.Validation("SUPPLIER_ADD_ERROR", response?.Message ?? "Failed to add supplier"));
        }
        catch (Exception ex)
        {
            return Result<SupplierItem, DomainError>.Failure(DomainError.Internal("SUPPLIER_ADD_ERROR", ex.Message));
        }
    }

    public async Task<Result<SupplierItem, DomainError>> UpdateAsync(int id, SupplierUpdate request, int userRoleId, CancellationToken cancellationToken = default)
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
            return Result<SupplierItem, DomainError>.Failure(DomainError.Validation("SUPPLIER_UPDATE_ERROR", response?.Message ?? "Failed to update supplier"));
        }
        catch (Exception ex)
        {
            return Result<SupplierItem, DomainError>.Failure(DomainError.Internal("SUPPLIER_UPDATE_ERROR", ex.Message));
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
              : Result<bool, DomainError>.Failure(DomainError.Validation("SUPPLIER_DELETE_ERROR", response?.Message ?? "Failed to delete supplier"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("SUPPLIER_DELETE_ERROR", ex.Message));
        }
    }
}
