namespace Configuracion.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WhatsappUsageController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public WhatsappUsageController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse>> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Config.WhatsappUsage_Get");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al obtener el uso de whatsapp");

            _log.LogActivity("Error on get: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return _response;
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse>> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Config.WhatsappUsage_Insert");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al guardar el uso de whatsapp");

            _log.LogActivity("Error on post: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return _response;
    }

    [HttpPut]
    public async Task<ActionResult<ApiResponse>> Put(int id, [FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Config.WhatsappUsage_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al actualizar el uso de whatsapp");

            _log.LogActivity("Error on put: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return _response;
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse>> Delete(int id)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Config.WhatsappUsage_Delete");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al eliminar el uso de whatsapp");

            _log.LogActivity("Error on delete: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return _response;
    }
}
