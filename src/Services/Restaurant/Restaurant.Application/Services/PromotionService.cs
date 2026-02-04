using Restaurant.Application.Dtos.Promotions;

namespace Restaurant.Application.Services;

public class PromotionService(IAdoRepository repository) : IPromotionService
{
    private const string baseSpName = "Restaurant.Promotion";
    public async Task<Result<PagedResult<PromotionItem>, DomainError>> GetAsync(PaginationRequest paginationRequest)
    {
        try
        {
            var response =
                await repository.GetPagedFromStoredProcedureAsync<PromotionItem>($"{baseSpName}Get",
                    paginationRequest);

            if (response == null || response.Items == null || !response.Items.Any())
            {
                var error = DomainError.NotFound("PROMOTIONS_NOT_FOUND", "No Promotions were found.");
                return Result<PagedResult<PromotionItem>, DomainError>.Failure(error);
            }

            return Result<PagedResult<PromotionItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("PROMOTIONS_GET_ERROR",
                $"An error occurred while retrieving promotions. {ex.Message}");
            return Result<PagedResult<PromotionItem>, DomainError>.Failure(error);
        }
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync($"{baseSpName}GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{baseSpName}Insert", parameters);
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await repository.QuerySingleOrDefaultAsync<SpResponse>($"{baseSpName}Update", parameters);
    }
}
