namespace Configuracion.Application.Services;

public class UserProfileService : IUserProfileService
{
    private readonly IAdoRepository _repository;
    private readonly string nameSchema = "Config.UserProfile";

    public UserProfileService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await _repository.SpExecuteAsync<ApiResponse>(nameSchema + "_Update", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);

        if (ds == null)
        {
            return new ApiResponse { Code = "0", Message = "No se pudo obtener los datos" };
        }

        return new ApiResponse { Code = "0", Message = "Ok", Payload = DataConverters.DataSetToJson(ds) };
    }
}
