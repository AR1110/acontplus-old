

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Compras.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DocumentoDetalleController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly DbAccess _db;
    private readonly ICustomLogger _log;

    public DocumentoDetalleController(IConfiguration config, ICustomLogger log)
    {
        _config = config;
        _db = new DbAccess(_config);
        _log = log;
    }

    // GET: api/<DocumentoDetalleController>
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new[] { "value1", "value2" };
    }

    // GET api/<DocumentoDetalleController>/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/<DocumentoDetalleController>
    [HttpPost("{idDocumento}/{idArticulo}")]
    public async Task<IActionResult> Post(int idDocumento, int idArticulo)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Recepcion.DocumentoDetalle_Insert", true);
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("idDocumento", idDocumento);
            _db.AddDynamicParam("idArticulo", idArticulo);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on DocumentoDetalle/Post: " + idDocumento + "-> \n" + ex);
            _response.Create("0", "Error al guardar el detalle");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    // PUT api/<DocumentoDetalleController>/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/<DocumentoDetalleController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            await _db.SPExecute("Recepcion.DocumentoDetalle_Delete");
            _db.AddDynamicParam("idUsuarioRol",
                Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        catch (Exception ex)
        {
            _log.LogActivity("Error on DocumentoDetalle/Delete: " + id + "-> \n" + ex);
            _response.Create("0", "Error al eliminar el articulo del stock");
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
