namespace Purchases.Application.Services;

public class DocumentDetailService(IUnitOfWork unitOfWork) : IDocumentDetailService
{
    private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
    private const string ModuleName = "Purchases.DocumentDetail";

    public async Task<Result<IReadOnlyList<object>, DomainError>> GetAsync(int documentId, int userRoleId, CancellationToken cancellationToken = default)
    {
        try
        {
            var parameters = new Dictionary<string, object> { { "documentId", documentId }, { "userRoleId", userRoleId } };
            var items = await _adoRepository.QueryAsync<object>($"{ModuleName}Get", parameters);
            return Result<IReadOnlyList<object>, DomainError>.Success(items.ToList().AsReadOnly());
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyList<object>, DomainError>.Failure(DomainError.Internal("DOCUMENT_DETAIL_GET_ERROR", ex.Message));
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
              : Result<object, DomainError>.Failure(DomainError.Validation("DOCUMENT_DETAIL_ADD_ERROR", response?.Message ?? "Failed to add detail"));
        }
        catch (Exception ex)
        {
            return Result<object, DomainError>.Failure(DomainError.Internal("DOCUMENT_DETAIL_ADD_ERROR", ex.Message));
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
              : Result<object, DomainError>.Failure(DomainError.Validation("DOCUMENT_DETAIL_UPDATE_ERROR", response?.Message ?? "Failed to update detail"));
        }
        catch (Exception ex)
        {
            return Result<object, DomainError>.Failure(DomainError.Internal("DOCUMENT_DETAIL_UPDATE_ERROR", ex.Message));
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
              : Result<bool, DomainError>.Failure(DomainError.Validation("DOCUMENT_DETAIL_DELETE_ERROR", response?.Message ?? "Failed to delete detail"));
        }
        catch (Exception ex)
        {
            return Result<bool, DomainError>.Failure(DomainError.Internal("DOCUMENT_DETAIL_DELETE_ERROR", ex.Message));
        }
    }
}
