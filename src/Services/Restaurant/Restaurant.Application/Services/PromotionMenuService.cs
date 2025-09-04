namespace Restaurant.Application.Services;

public class PromotionMenuService(IAdoRepository repository) : IPromotionMenuService
{
    public async Task<SpResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Restaurant.Promotion_Menu_Get_By_Id", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
