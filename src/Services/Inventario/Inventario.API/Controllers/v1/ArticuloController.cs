namespace Inventario.API.Controllers.v1;

[Route("api/articulo/[action]")]
[ApiController]
[ApiVersion("1.0")]
public class ArticuloController : ControllerBase
{ 
    private readonly S3ObjectCustom _s3ObjectCustom;
    private readonly IS3StorageService _storageService;
    private readonly IArticuloService _svc;

    public ArticuloController(IConfiguration configuration,
        S3ObjectCustom s3ObjectCustom,
        IS3StorageService storageService,
        IArticuloService svc)
    { 
        _s3ObjectCustom = s3ObjectCustom;
        _storageService = storageService;
        _svc = svc;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        if (!DataValidation.IsValidJson(json))
        {
            return BadRequest("Caracteres de busqueda invalidos");
        }
        var parameters = new Dictionary<string, object>{
            { "idRol", User.GetUserRoleId() }, 
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _svc.GetAsync(parameters);
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
    public async Task<IActionResult> Post(string json, IFormFile file)
    { 
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);
         
        if (file != null)
        {
            await _s3ObjectCustom.Add($"{User.GetIdCardCompany()}/articulos/", file);
        }

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, 
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "s3ObjectKey",  _s3ObjectCustom.S3ObjectKey ?? "" },
            { "s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" }
        };
        var response = await _svc.AddAsync(parameters);
         
        if (response.Code == "1" && file != null)
        {
            var s3Response = await _storageService.UploadAsync(_s3ObjectCustom);
            _s3ObjectCustom.Dispose();
        } 

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var data = JsonConvert.DeserializeObject<ApiRequest>(json);
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
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

    [HttpGet]
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

        return Ok(await _svc.SearchAsync(parameters)); 
        
    }
     
     
}
