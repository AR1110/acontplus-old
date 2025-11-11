using Restaurant.Application.Dtos.Items;

namespace Restaurant.Application.Services;

public class ItemService(IAdoRepository adoRepository) : IItemService
{
    public async Task<Result<PagedResult<ItemListResponse>, DomainError>> GetAsync(PaginationRequest paginationRequest)
    {
        try
        {
            var response = await adoRepository.GetPagedFromStoredProcedureAsync<ItemListResponse>("Restaurant.GetItem", paginationRequest);

            if (response == null || response.Items == null || !response.Items.Any())
            {
                var error = DomainError.NotFound("ITEMS_NOT_FOUND", "No items were found.");
                return Result<PagedResult<ItemListResponse>, DomainError>.Failure(error);
            }

            return Result<PagedResult<ItemListResponse>, DomainError>.Success(response);
        }
        catch (Exception ex)
        {
            var error = DomainError.Internal("ITEMS_GET_ERROR", $"An error occurred while retrieving items. {ex.Message}");
            return Result<PagedResult<ItemListResponse>, DomainError>.Failure(error);
        }

    }

    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.GetByIdItem", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.UpdateItem", parameters);
}
