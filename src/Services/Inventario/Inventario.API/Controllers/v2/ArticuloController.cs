namespace Inventario.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class ArticuloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public ArticuloController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }


    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            if (!DataValidation.IsValidJson(json))
            {
                return BadRequest("Caracteres de busqueda invalidos");
            }

            await _db.SPExecute("Inventario.Articulo_Get");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar articulos: \n" + ex);
            _response.Create("0", "Error al listar articulos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            if (!DataValidation.IsValidJson(json))
            {
                return BadRequest("Caracteres de busqueda invalidos");
            }

            await _db.SPExecute("Inventario.Articulo_Get_Search");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on Get Search: \n" + ex);
            _response.Create("0", "Error al obtener las bodegas");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Get_Id");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in articulo getId: \n" + ex.Message);
            _response.Create("0", "Error al Obtener los datos del articulo " + ex.Message);
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Insert");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _db.AddDynamicParam("s3ObjectKey", "");
            _db.AddDynamicParam("s3ObjectUrl", "");
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar articulo: \n" + ex);
            _response.Create("0", "Error al insertar articulo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Inventario.Articulo_Update");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar articulo: \n" + ex);
            _response.Create("0", "Error al actualizar articulo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Inventario.Articulo_Delete");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar articulo: \n" + ex);
            _response.Create("0", "Error al eliminar articulo");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
