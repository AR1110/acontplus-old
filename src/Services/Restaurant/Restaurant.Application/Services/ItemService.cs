namespace Restaurant.Application.Services;

public class ItemService(IAdoRepository adoRepository) : IItemService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_Get", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Item_GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Item_Update", parameters);
}
