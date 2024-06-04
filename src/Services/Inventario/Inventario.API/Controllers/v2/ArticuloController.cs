namespace Inventario.API.Controllers.v2;

[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
[ApiVersion("2.0")]
public class ArticuloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    

    public ArticuloController(IConfiguration configuration)
    {
        _configuration = configuration;
        
    }


    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            if (!DataValidation.IsValidJson(json))
            {
                return BadRequest("Caracteres de busqueda invalidos");
            }

            await _db.SPExecute("Inventario.Articulo_Get");
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("Search")]
    public async Task<IActionResult> Search(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            if (!DataValidation.IsValidJson(json))
            {
                return BadRequest("Caracteres de busqueda invalidos");
            }

            await _db.SPExecute("Inventario.Articulo_Get_Search");
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Get_Id");
            _db.AddDynamicParam("id", id);
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Insert");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
            _db.AddDynamicParam("s3ObjectKey", "");
            _db.AddDynamicParam("s3ObjectUrl", "");
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ApiRequest parameters)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Inventario.Articulo_Update");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
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
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Inventario.Articulo_Delete");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
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
