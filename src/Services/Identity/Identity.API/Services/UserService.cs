using Acontplus.Utilities.Data;

namespace Identity.API.Services;

public class UserService(IAdoRepository repository) : IUserService
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Seguridad.User_Get", parameters);
        return DataValidation.DataSetIsNull(ds)
            ? new SpResponse { Code = "0", Message = "No se encontraron datos" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
