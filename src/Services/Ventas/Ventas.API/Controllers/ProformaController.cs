namespace Ventas.API.Controllers;

public class ProformaController(IConfiguration configuration, IProformaService _svc) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idUsuarioRol" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(json)},
            };
        return Ok(await _svc.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                {"userRoleId" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))},
            }; 

        return Ok(await _svc.AddAsync(parameters));
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest request)
    {

        var parameters = new Dictionary<string, object>
            {
                {"userRoleId" , User.GetUserRoleId()},
                {"id",id },
                {"json" , SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))},
            }; 

        return Ok(await _svc.UpdateAsync(parameters));
    }


    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idRol" , User.GetUserRoleId()},
                {"id",id }, 
            }; 

        return Ok(await _svc.DeleteAsync(parameters));
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idRol" , User.GetUserRoleId()},
                {"id" , id},
            };
        return Ok(await _svc.GetByIdAsync(parameters));
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                {"userRoleId" , User.GetUserRoleId()},
                {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data))},
            }; 

        return Ok(await _svc.ConvertToDoc(parameters));
    }
}
