using Common.AppSettings;

namespace Identity.API.Services;

public class UserService : IUserService
{
    private readonly IAdoRepository _repository;

    public UserService(IAdoRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Seguridad.User_Get", parameters);
        if (DataValidation.DataSetIsNull(ds))
        {
            return new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }

        return new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
