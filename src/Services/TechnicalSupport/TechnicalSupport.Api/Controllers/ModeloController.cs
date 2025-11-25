namespace TechnicalSupport.Api.Controllers;

public class ModeloController : BaseApiController
{
    private readonly IModeloRepository _modeloService;

    public ModeloController(IModeloRepository modeloService)
    {
        _modeloService = modeloService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _modeloService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Modelo modelo)
    {
        modelo.CreatedByUserId = User.GetUserId();
        var response = await _modeloService.AddAsync(modelo);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Modelo modelo)
    {
        modelo.UpdatedByUserId = User.GetUserId();
        var response = await _modeloService.UpdateAsync(id, modelo);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _modeloService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}
