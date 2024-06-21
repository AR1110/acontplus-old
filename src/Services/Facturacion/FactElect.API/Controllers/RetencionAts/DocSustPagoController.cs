

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FactElect.API.Controllers.RetencionAts;

[Route("api/[controller]")]
[ApiController]
public class DocSustPagoController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    

    public DocSustPagoController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        
    }

    // GET: api/<DocPagoController>
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new[] { "value1", "value2" };
    }

    // GET api/<DocPagoController>/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/<DocPagoController>
    [HttpPost("{idDocSust}")]
    public async Task<IActionResult> Post(int idDocSust, string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            
            await _db.SPExecute("FactElect.RetAts_Doc_Sust_Pago_Insert");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("idDocSust", idDocSust);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    // PUT api/<DocPagoController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            
            await _db.SPExecute("FactElect.RetAts_Doc_Sust_Pago_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    // DELETE api/<DocPagoController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            
            await _db.SPExecute("FactElect.RetAts_Doc_Sust_Pago_Delete");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
