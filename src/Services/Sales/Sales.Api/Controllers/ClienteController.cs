using Acontplus.Core.Extensions;

namespace Sales.Api.Controllers;

public class ClienteController(IClienteService clienteService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.GetAsync(parameters));
    }

    //Eliminar mas adelante
    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.GetDataFormAsync(parameters));
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        if (!DataValidation.IsValidJson(json)) return BadRequest("Caracteres de busqueda invalidos");

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.SearchAsync(parameters));
    }


    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] ClienteDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", JsonExtensions.SerializeOptimized(data) }
        };
        return Ok(await clienteService.AddAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClienteDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id },
            { "json", JsonExtensions.SerializeOptimized(data) }
        };
        return Ok(await clienteService.UpdateAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await clienteService.DeleteAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await clienteService.GetByIdAsync(parameters));
    }
}
