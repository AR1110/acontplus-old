namespace Purchases.Application.Services;

public class DocumentTempService(IUnitOfWork unitOfWork) : IDocumentTempService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.DocumentoTemp_";

  public async Task<Result<IReadOnlyList<object>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
      var items = await _adoRepository.QueryAsync<object>($"{ModuleName}Get", parameters);
      return Result<IReadOnlyList<object>, DomainError>.Success(items.ToList().AsReadOnly());
    }
    catch (Exception ex)
    {
      return Result<IReadOnlyList<object>, DomainError>.Failure(DomainError.Internal("DOCUMENT_TEMP_GET_ERROR", ex.Message));
    }
  }

  public async Task<Result<object, DomainError>> AddAsync(object request, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "data", JsonExtensions.SerializeOptimized(request) } };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Insert", parameters);
      return response?.Code == "0"
        ? Result<object, DomainError>.Success(request)
        : Result<object, DomainError>.Failure(DomainError.Validation("DOCUMENT_TEMP_ADD_ERROR", response?.Message ?? "Failed to add temp document"));
    }
    catch (Exception ex)
    {
      return Result<object, DomainError>.Failure(DomainError.Internal("DOCUMENT_TEMP_ADD_ERROR", ex.Message));
    }
  }

  public async Task<Result<object, DomainError>> UpdateAsync(int id, object request, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "id", id }, { "data", JsonExtensions.SerializeOptimized(request) } };
      var response = await _adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{ModuleName}Update", parameters);
      return response?.Code == "0"
        ? Result<object, DomainError>.Success(request)
        : Result<object, DomainError>.Failure(DomainError.Validation("DOCUMENT_TEMP_UPDATE_ERROR", response?.Message ?? "Failed to update temp document"));
    }
    catch (Exception ex)
    {
      return Result<object, DomainError>.Failure(DomainError.Internal("DOCUMENT_TEMP_UPDATE_ERROR", ex.Message));
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
        : Result<bool, DomainError>.Failure(DomainError.Validation("DOCUMENT_TEMP_DELETE_ERROR", response?.Message ?? "Failed to delete temp document"));
    }
    catch (Exception ex)
    {
      return Result<bool, DomainError>.Failure(DomainError.Internal("DOCUMENT_TEMP_DELETE_ERROR", ex.Message));
    }
  }
}
