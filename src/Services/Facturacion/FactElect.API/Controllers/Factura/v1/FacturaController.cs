using FactElect.API.Interfaces;

namespace FactElect.API.Controllers.Factura.v1;

//[Route("api/[controller]")]
[Route("api/factura/[action]")]
[ApiController]
public class FacturaController : ControllerBase
{ 

    private readonly IFacturaService _svc;

    public FacturaController(IFacturaService service)
    { 
        _svc = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {   
        var response = await _svc.GetAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            });
        if (response == null) { return NoContent(); }
        return Ok(new { code = "1", payload = response });

    }

    [HttpPost]
    public async Task<IActionResult> Insert(ApiRequest data)
    {  
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await _svc.AddAsync(parameters); 
        return Ok(response);

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
