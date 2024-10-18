namespace Common.API.Services;
public interface IUserManualService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
}
public class UserManualService(IAdoRepository adoRepository) : IUserManualService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var dt = await adoRepository.GetDataTableAsync("Common.UserManual_Get", parameters);
        if (DataValidation.DataTableIsNull(dt))
        {
            return new ApiResponse { Code = "0", Message = "Data not found!" };
        }
        return new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
    }
}
