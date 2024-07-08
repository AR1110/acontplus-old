namespace Ventas.API.Controllers;

public class ProformaController(IConfiguration configuration, IProformaService proformaService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idUsuarioRol" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(json)},
            };
        return Ok(await proformaService.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(ApiRequest parameters)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {

            await _db.SpExecuteAsync("Ventas.Proforma_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest parameters)
    {
        var _db = new DbAccess(configuration);

        var _response = new ApiResponseDeprecated();
        try
        {

            await _db.SpExecuteAsync("Ventas.Proforma_Update");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }


    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _db = new DbAccess(configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SpExecuteAsync("Ventas.Proforma_Delete", true);
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("GetId/{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idRol" , User.GetUserRoleId()},
                {"id" , id},
            };
        return Ok(await proformaService.GetByIdAsync(parameters));
    }

    [HttpPost("ConvertToDoc")]
    public async Task<IActionResult> ConvertToDoc(ApiRequest parameters)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {

            await _db.SpExecuteAsync("Ventas.Proforma_Convert_To_Doc", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
