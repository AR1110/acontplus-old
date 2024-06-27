using FactElect.API.Interfaces;

namespace FactElect.API.Controllers.Factura.v1;

//[Route("api/[controller]")]
[Route("api/factura/[action]")]
[ApiController]
public class FacturaController : ControllerBase
{ 

    private readonly IFacturaService _svc;

    public FacturaController(IConfiguration configuration)
    {
        _configuration = configuration;
        _db = new DbAccess(_configuration);

    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            
            await _db.SPExecute("Ventas.Factura_Get", true);
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

    [HttpPost]
    public async Task<IActionResult> Insert(ApiRequest data)
    {
        var _response = new ApiResponseDeprecated();
        try
        {
            
            await _db.SPExecute("Ventas.Factura_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }
            await _db.SPExecute("Ventas.Factura_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }
>>>>>>>>> Temporary merge branch 2

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest data)
    {  
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await _svc.UpdateAsync(parameters); 
        return Ok(response);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {   
        var response = await _svc.GetByIdAsync(new Dictionary<string, object>
           {
                    { "idRol", User.GetUserRoleId() }, { "id", id }
           });
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response });

    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {  
        var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }
}
