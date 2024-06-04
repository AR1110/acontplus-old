using Common.Core.Models;
using Common.Core.Models.Almacen;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModeloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ICustomLogger _log;

    public ModeloController(IConfiguration configuration, ICustomLogger log)
    {
        _configuration = configuration;
        _log = log;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Modelo_Get");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar modelos: \n" + ex);
            _response.Create("0", "Error al listar modelos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] Modelo data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Modelo_Insert");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("idMarca", data.idMarca);
            _db.AddDynamicParam("descripcion", data.descripcion);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al insertar modelos: \n" + ex);
            _response.Create("0", "Error al insertar modelos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Modelo data)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Modelo_Update");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("idMarca", data.idMarca);
            _db.AddDynamicParam("descripcion", data.descripcion);
            _db.AddDynamicParam("estado", data.estado);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al actualizar modelos: \n" + ex);
            _response.Create("0", "Error al actualizar modelos");
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Modelo_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al eliminar modelos: \n" + ex);
            _response.Create("0", "Error al eliminar modelos");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("ListForSelect")]
    public async Task<IActionResult> ListForSelect(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Modelo_For_Select");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _response = _db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error al listar modelos para Select: \n" + ex);
            _response.Create("0", "Error al listar modelos para Select");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
