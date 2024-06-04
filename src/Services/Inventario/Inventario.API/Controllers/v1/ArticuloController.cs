namespace Inventario.API.Controllers.v1;

[Route("api/articulo/[action]")]
[ApiController]
[ApiVersion("1.0")]
public class ArticuloController : ControllerBase
{
    private readonly IConfiguration _configuration;
    
    private readonly S3ObjectCustom _s3ObjectCustom;
    private readonly IS3StorageService _storageService;

    public ArticuloController(IConfiguration configuration,
        S3ObjectCustom s3ObjectCustom,
        IS3StorageService storageService)
    {
        _configuration = configuration;
        _s3ObjectCustom = s3ObjectCustom;
        _storageService = storageService;
        
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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetId(int id)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Inventario.Articulo_Get_Id");
            //_db.AddDynamicParam("idRol", User.GetUserRoleId());
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
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);

        try
        {
            if (file != null)
            {
                await _s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
            }

            await _db.SPExecute("Inventario.Articulo_Insert", true);
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
            _db.AddDynamicParam("s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "");
            _db.AddDynamicParam("s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "");
            _response = _db.GetDefault();
            if (_response.code == "1" && file != null)
            {
                var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
            }
        }
        finally
        {
            _db.Close();
            if (file != null)
            {
                _s3ObjectCustom.Dispose();
            }
        }

        return Ok(_response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);

        try
        {
            await _db.SPExecute("Inventario.Articulo_Update");
            _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
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
            _db.AddDynamicParam("idRol",
                User.GetUserRoleId());
            _db.AddDynamicParam("id", id);
            _response = _db.GetDefault();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet]
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
            _response = _db.GetDataTableAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet]
    public async Task<IActionResult> FindForPurchase(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Articulo_Get_Id_By_Purchase");
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

    [HttpGet]
    public async Task<IActionResult> FindForSale(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Almacen.Articulo_Get_Id_By_Sale");
            _db.AddDynamicParam("idRol", User.GetUserRoleId());
            _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
            _response = _db.GetDataSetAsync();
        }
        finally
        {
            _db.Close();
        }

        return Ok(_response);
    }

    [HttpGet]
    public async Task<IActionResult> GetDataForm(string json)
    {
        var _response = new ApiResponse();
        var _db = new DbAccess(_configuration);
        try
        {
            await _db.SPExecute("Sistema.Almacen_Get_Data_Form");
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
}
