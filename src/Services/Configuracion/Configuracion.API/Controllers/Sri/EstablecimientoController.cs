namespace Configuracion.API.Controllers.Sri;

public class EstablecimientoController : BaseApiController
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public EstablecimientoController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Get");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Get: \n" + ex);
            _response.Create("0", "Error al Obtener los datos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("GetId")]
    public async Task<IActionResult> GetId(string json)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Get_Id");
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in GetId: \n" + ex);
            _response.Create("0", "Error al Obtener los datos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm()
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Get_Data_Form");
            _response = _db.GetDataSetAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in GetDataForm: \n" + ex);
            _response.Create("0", "Error al Obtener los datos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Insert(string json)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Insert");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Insert: \n" + ex);
            _response.Create("0", "Error al guardar");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, string json)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Update");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Update: \n" + ex);
            _response.Create("0", "Error al actualizar");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("PutSriAuth/{id}/{autoSriAuth}")]
    public async Task<IActionResult> PutSriAuth(int id, bool autoSriAuth)
    {
        var _response = new ApiResponse();
        try
        {
            using (var _db = new DbAccess(_configuration))
            {
                var query = @"UPDATE Sri.Establecimiento SET autoSriAuth = @autoSriAuth WHERE idEstablecimiento = @id";
                await _db.QueryExecute(query);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("autoSriAuth", autoSriAuth);
                var affectedRows = await _db.OnlyExecuteAsync();
                _response.Create(affectedRows > 0 ? "1" : "0",
                    affectedRows > 0 ? "Actualizado exitosamente" : "No se actualizo");
            }
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Put Sri Auto: \n" + ex);
            _response.Create("0", "Error al actualizar");
        }

        return Ok(_response);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var _db = new DbAccess(_configuration);

        var _response = new ApiResponse();
        try
        {
            await _db.SPExecute("Sri.Establecimiento_Delete");
            _db.AddDynamicParam("idRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error in Delete: \n" + ex);
            _response.Create("0", "Error al eliminar");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
