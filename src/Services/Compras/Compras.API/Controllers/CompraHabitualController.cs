namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CompraHabitualController(IConfiguration configuration, ICustomLogger log) : ControllerBase
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var db = new DbAccess(configuration);
        var response = new ApiResponseDeprecated();
        try
        {
            await db.SPExecute("Recepcion.CompraHabitual_Get");
            db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            db.AddDynamicParam("json", json);
            response = await db.GetDataTableAsync();
        }
        catch (Exception ex)
        {
            response.Create("0", "Error al guardar");

            log.LogActivity("Error on Get compra habitual: \n" + ex);
        }
        finally
        {
            db.Close();
        }

        return Ok(response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var db = new DbAccess(configuration);
        var response = new ApiResponseDeprecated();
        try
        {
            await db.SPExecute("Recepcion.CompraHabitual_Insert");
            db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            response = db.GetDefault();
        }
        catch (Exception ex)
        {
            response.Create("0", "Error al guardar");

            log.LogActivity("Error on Post compra habitual: \n" + ex);
        }
        finally
        {
            db.Close();
        }

        return Ok(response);
    }

    [HttpPut("Put")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _db = new DbAccess(configuration);
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Recepcion.CompraHabitual_Update");
            _db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", json);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _response.Create("0", "Error al guardar");

            log.LogActivity("Error on Put compra habitual: \n" + ex);
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = new DbAccess(configuration);
        var response = new ApiResponseDeprecated();
        try
        {
            await db.SPExecute("Recepcion.CompraHabitual_Delete");
            db.AddDynamicParam("idUsuarioRol",
                User.GetUserRoleId());
            db.AddDynamicParam("id", id);
            response = db.GetDefault();
        }
        catch (Exception ex)
        {
            response.Create("0", "Error al guardar");

            log.LogActivity("Error on Delete compra habitual: \n" + ex);
        }
        finally
        {
            db.Close();
        }

        return Ok(response);
    }
}
