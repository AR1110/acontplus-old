

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FactElect.API.Controllers.RetencionAts;

[Route("api/[controller]")]
[ApiController]
public class RetAtsInfoAdicionalController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly DbAccess _db;
    

    public RetAtsInfoAdicionalController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);
        
    }

    // GET: api/<RetAtsInfoAdicionalController>
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new[] { "value1", "value2" };
    }

    // GET api/<RetAtsInfoAdicionalController>/5
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "value";
    }

    // POST api/<RetAtsInfoAdicionalController>
    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("FactElect.RetAts_InfoAdicional_Insert");

            var parameters = new Dictionary<string, object>
            {
                { "idUsuarioRol", idUsuarioRol }, { "json", SqlStringParam.Sanitize(json) }
            };
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    // PUT api/<RetAtsInfoAdicionalController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("FactElect.RetAts_InfoAdicional_Update");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
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

    // DELETE api/<RetAtsInfoAdicionalController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponse();
        try
        {
            var idUsuarioRol = User.GetUserRoleId();
            await _db.SPExecute("FactElect.RetAts_InfoAdicional_Delete");
            _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
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
