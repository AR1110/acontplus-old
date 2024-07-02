namespace Inventario.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class ArticuloController : ControllerBase
{ 
    private readonly IArticuloService _svc;
    

    public ArticuloController(IArticuloService svc)
    { 
        _svc = svc;
        
    }


    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>{
            { "idRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _svc.GetAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response }); 
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        if (!DataValidation.IsValidJson(json))
        {
            return BadRequest("Caracteres de busqueda invalidos");
        }

        var parameters = new Dictionary<string, object>{
            { "idRol", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await _svc.SearchAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response }); 
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var parameters = new Dictionary<string, object>{
            { "id", id }
        };
        var response = await _svc.GetByIdAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response });
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) },
            { "s3ObjectKey",   "" },
            { "s3ObjectUrl",  "" }
        };
        var response = await _svc.AddAsync(parameters); 
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
            };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response); 
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }
}
