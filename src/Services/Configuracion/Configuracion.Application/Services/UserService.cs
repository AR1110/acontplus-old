namespace Configuracion.Application.Services;

public class UserService(IAdoRepository adoRepository) : IUserService
{
    private const string NameSchema = "Config.UserCustomer";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync(NameSchema + "_Get", parameters);
        return ds.Tables.Count == 0 ? null : DataConverters.DataSetToJson(ds);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "_Insert", parameters);

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters) =>
        await adoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "_Update", parameters);
}
