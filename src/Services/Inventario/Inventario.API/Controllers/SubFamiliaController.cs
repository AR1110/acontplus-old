namespace Inventario.API.Controllers;

public class SubFamiliaController : BaseApiController
{

    private readonly S3ObjectCustom _s3ObjectCustom;
    private readonly ISubFamiliaService _service;
    private readonly IS3StorageService _storageService;

    public SubFamiliaController(S3ObjectCustom s3ObjectCustom, IS3StorageService storageService,
        ISubFamiliaService service)
    {
        _s3ObjectCustom = s3ObjectCustom;
        _storageService = storageService;
        _service = service;

    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await _service.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json, IFormFile file)
    {
        if (file != null)
        {
            await _s3ObjectCustom.Add($"{User.GetIdCardCompany()}/subfamilias/", file);
        }

        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(json) },
                { "s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "" },
                { "s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" }
            };

        var response = await _service.AddAsync(parameters);

        if (response.Code == "1" && file != null)
        {
            await _storageService.UploadAsync(_s3ObjectCustom);
        }

        if (file != null)
        {
            _s3ObjectCustom.Dispose();
        }

            ;
        return Ok(response);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> PostApp(string json)
    {

        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(json) },
                { "s3ObjectKey", _s3ObjectCustom.S3ObjectKey ?? "" },
                { "s3ObjectUrl", _s3ObjectCustom.S3ObjectUrl ?? "" }
            };

        var response = await _service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "id", id }, { "json", SqlStringParam.Sanitize(json) }
            };

        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "id", id } };

        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }


    //[HttpGet("ListForSelect")]
    //public async Task<IActionResult> ListForSelect(string json)
    //{
    //    ApiResponse _response = new ApiResponse();
    //    DbAccess _db = new DbAccess(_configuration);
    //    try
    //    {
    //        await _db.SPExecute("Almacen.SubFamilia_For_Select");
    //        _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
    //        _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
    //        _response = _db.GetDataTableAsync();
    //    }
    //    catch (Exception ex)
    //    {

    //        _log.LogActivity("Error al listar SubFamilias para Select: \n" + ex.ToString());
    //        _response.Create(code: "0", message: "Error al listar SubFamilias para Select");
    //    }
    //    finally
    //    {
    //        _db.Close();
    //    }
    //    return Ok(_response);
    //}
}
