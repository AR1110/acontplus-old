namespace Common.Application.Services;

public class UserManualService(IAdoRepository adoRepository) : IUserManualService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Common.UserManual_Get", parameters);
        if (DataValidation.DataSetIsNull(ds)) return new SpResponse { Code = "0", Message = "Data not found!" };

        CompressionUtils.DecompressColumn(ds, "userManuals", "CompressedContent", "Content");

        return new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
