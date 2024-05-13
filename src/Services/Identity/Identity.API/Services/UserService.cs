namespace Identity.API.Services;

public class UserService : IUserService
{
    private readonly IADORepository _repository;

    public UserService(IADORepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await _repository.GetDataSetAsync("Seguridad.User_Get", parameters);
        if (DataValidation.DataSetIsNull(ds))
        {
            return new ApiResponse { code = "0", message = "No se encontraron datos" };
        }

        return new ApiResponse { code = "1", payload = DataConverters.DataSetToJSON(ds) };
    }
}
