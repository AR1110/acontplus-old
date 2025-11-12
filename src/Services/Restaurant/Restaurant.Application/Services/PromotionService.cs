using Restaurant.Application.DTOs.Promotions;

namespace Restaurant.Application.Services;

public class PromotionService(IAdoRepository repository) : IPromotionService
{
    public async Task<Result<PagedResult<PromotionResponse>, DomainError>> GetAsync(PaginationRequest paginationRequest)
    {
        try
        {
            var response = await repository.GetPagedFromStoredProcedureAsync<PromotionResponse>("Restaurant.GetPromotion", paginationRequest);

            if (response == null || response.Items == null || !response.Items.Any())
            {
                var error = DomainError.NotFound("PROMOTIONS_NOT_FOUND", "No Promotions were found.");
                return Result<PagedResult<PromotionResponse>, DomainError>.Failure(error);
            }

            return Result<PagedResult<PromotionResponse>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("PROMOTIONS_GET_ERROR", $"An error occurred while retrieving promotions. {ex.Message}");
            return Result<PagedResult<PromotionResponse>, DomainError>.Failure(error);
        }
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.GetByIdItem", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.InsertPromotion", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.UpdatePromotion", parameters);
    }
}
