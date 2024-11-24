namespace Ventas.API.Controllers;

public class ClienteController(IConfiguration configuration, IClienteService clienteService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.GetAsync(parameters));
    }

    //Eliminar mas adelante
    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.GetDataFormAsync(parameters));
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        if (!DataValidation.IsValidJson(json))
        {
            return BadRequest("Caracteres de busqueda invalidos");
        }

        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await clienteService.SearchAsync(parameters));
    }


    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] Cliente data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            await _db.SpExecuteAsync("Ventas.Cliente_Insert");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Cliente data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            await _db.SpExecuteAsync("Ventas.Cliente_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            await _db.SpExecuteAsync("Ventas.Cliente_Delete");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = await _db.GetDefaultAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        return Ok(await clienteService.GetByIdAsync(parameters));
    }
}
