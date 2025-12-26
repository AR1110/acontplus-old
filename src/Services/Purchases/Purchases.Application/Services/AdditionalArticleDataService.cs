using Purchases.Application.Dtos.Articles;

namespace Purchases.Application.Services;

public class AdditionalArticleDataService(IUnitOfWork unitOfWork) : IAdditionalArticleDataService
{
  private readonly IAdoRepository _adoRepository = unitOfWork.AdoRepository;
  private const string ModuleName = "Compra.DatoAdicionalArticulo_";

  public async Task<Result<IReadOnlyList<AdditionalArticleDataItem>, DomainError>> GetAsync(int userRoleId, CancellationToken cancellationToken = default)
  {
    try
    {
      var parameters = new Dictionary<string, object> { { "userRoleId", userRoleId } };
      var data = await _adoRepository.QueryAsync<AdditionalArticleDataItem>($"{ModuleName}Get", parameters);
      return Result<IReadOnlyList<AdditionalArticleDataItem>, DomainError>.Success(data.ToList().AsReadOnly());
    }
    catch (Exception ex)
    {
      return Result<IReadOnlyList<AdditionalArticleDataItem>, DomainError>.Failure(DomainError.Internal("ADDITIONAL_DATA_GET_ERROR", ex.Message));
    }
  }

  public async Task<Result<AdditionalArticleDataItem, DomainError>> AddAsync(AdditionalArticleDataCreate request, CancellationToken cancellationToken = default)
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
        var item = new AdditionalArticleDataItem(newId, request.DocumentId, request.AdditionalInfo);
        return Result<AdditionalArticleDataItem, DomainError>.Success(item);
      }
      return Result<AdditionalArticleDataItem, DomainError>.Failure(DomainError.Validation("ADDITIONAL_DATA_ADD_ERROR", response?.Message ?? "Failed to add data"));
    }
    catch (Exception ex)
    {
      return Result<AdditionalArticleDataItem, DomainError>.Failure(DomainError.Internal("ADDITIONAL_DATA_ADD_ERROR", ex.Message));
    }
  }

  public async Task<Result<AdditionalArticleDataItem, DomainError>> UpdateAsync(int id, AdditionalArticleDataUpdate request, int userRoleId, CancellationToken cancellationToken = default)
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
        var item = new AdditionalArticleDataItem(id, request.DocumentId, request.AdditionalInfo);
        return Result<AdditionalArticleDataItem, DomainError>.Success(item);
      }
      return Result<AdditionalArticleDataItem, DomainError>.Failure(DomainError.Validation("ADDITIONAL_DATA_UPDATE_ERROR", response?.Message ?? "Failed to update data"));
    }
    catch (Exception ex)
    {
      return Result<AdditionalArticleDataItem, DomainError>.Failure(DomainError.Internal("ADDITIONAL_DATA_UPDATE_ERROR", ex.Message));
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
        : Result<bool, DomainError>.Failure(DomainError.Validation("ADDITIONAL_DATA_DELETE_ERROR", response?.Message ?? "Failed to delete data"));
    }
    catch (Exception ex)
    {
      return Result<bool, DomainError>.Failure(DomainError.Internal("ADDITIONAL_DATA_DELETE_ERROR", ex.Message));
    }
  }
}
