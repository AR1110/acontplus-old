namespace Ventas.API.Controllers.v1;

public class ClienteController(IConfiguration configuration, IClienteService clienteService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idRol" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(json)},
            };
        return Ok(await clienteService.GetAsync(parameters));
    }

    //Eliminar mas adelante
    [HttpGet("GetDataForm")]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                {"idUsuarioRol" , User.GetUserRoleId()},
                {"json" , SqlStringParam.Sanitize(json)},
            };
        return Ok(await clienteService.GetDataFormAsync(parameters));
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            if (!DataValidation.IsValidJson(json))
            {
                return BadRequest("Caracteres de busqueda invalidos");
            }

            await _db.SPExecute("Ventas.Cliente_Get_Search");
            _db.AddDynamicParam("idRol ", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataTableAsync();
        }
        finally { _db.Close(); }

        return Ok(_response);
    }


    [HttpPost]
    public async Task<IActionResult> Insert([FromBody] Cliente data)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {

            await _db.SPExecute("Ventas.Cliente_Insert");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
            _response = _db.GetDefault();
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

            await _db.SPExecute("Ventas.Cliente_Update");
            _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", JsonConvert.SerializeObject(data));
            _response = _db.GetDefault();
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

            await _db.SPExecute("Ventas.Cliente_Delete");
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

    [HttpGet("{id}")]
    public async Task<IActionResult> FindById(int id)
    {
        var _response = new ApiResponseDeprecated();
        var _db = new DbAccess(configuration);
        try
        {
            await _db.SPExecute("Ventas.Cliente_Get_Id");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }
}
