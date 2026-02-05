using Restaurant.Application.Dtos.Items;

namespace Restaurant.Application.Services;

public class ItemService(IAdoRepository adoRepository) : IItemService
{
    private  const string baseSpName = "Restaurant.Item";
    public async Task<Result<PagedResult<ItemItem>, DomainError>> GetAsync(PaginationRequest paginationRequest)
    {
        try
        {
            var response =
                await adoRepository.GetPagedFromStoredProcedureAsync<ItemItem>($"{baseSpName}Get", paginationRequest);

            if (response == null || response.Items == null || !response.Items.Any())
            {
                var error = DomainError.NotFound("ITEMS_NOT_FOUND", "No items were found.");
                return Result<PagedResult<ItemItem>, DomainError>.Failure(error);
            }

            return Result<PagedResult<ItemItem>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("ITEMS_GET_ERROR",
                $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<ItemItem>, DomainError>.Failure(error);
        }
    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync($"{baseSpName}GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoRepository.QuerySingleOrDefaultAsync<SpResponse>($"{baseSpName}Update", parameters);
    }
}
